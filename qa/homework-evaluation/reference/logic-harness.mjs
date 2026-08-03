// Headless verification of the API-layer defects (no browser, no Cypress).
//   node homework-evaluation/reference/logic-harness.mjs
// Loads app/assets/js/{seed,flags,store,api}.js in a VM with stubbed
// window/localStorage/fetch and latency removed, then asserts each planted defect
// for two seeds (1000 -> B1/B2/B5, 1234 -> B3/B4/B6).
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import vm from 'node:vm';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const APP = path.resolve(HERE, '../../app');

function makeWindow(seed) {
  const store = new Map();
  const win = {
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k)
    },
    location: { search: `?seed=${seed}`, href: `http://x/?seed=${seed}` }
  };
  win.window = win;
  return win;
}

function loadApp(seed) {
  const win = makeWindow(seed);
  const sandbox = {
    window: win,
    URLSearchParams,
    Math,
    Date,
    JSON,
    Object,
    Array,
    Promise,
    Error,
    String,
    Number,
    parseInt,
    setTimeout: (fn) => fn(), // strip latency
    console,
    fetch: (p) =>
      Promise.resolve({
        json: () => Promise.resolve(JSON.parse(fs.readFileSync(path.join(APP, p), 'utf8')))
      })
  };
  vm.createContext(sandbox);
  for (const f of ['seed.js', 'flags.js', 'store.js', 'api.js']) {
    vm.runInContext(fs.readFileSync(path.join(APP, 'assets/js', f), 'utf8'), sandbox, {
      filename: f
    });
  }
  return win;
}

const results = [];
function check(name, pass, detail = '') {
  results.push({ name, pass, detail });
}

async function run(seed) {
  const w = loadApp(seed);
  const { AceUpApi: Api, AceUpStore: Store, Fx } = w;
  const active = ['fx_b1', 'fx_b2', 'fx_b3', 'fx_b4', 'fx_b5', 'fx_b6'].filter(Fx);
  console.log(`\n=== seed ${seed} — Tier B active: ${active.join(', ')} ===`);

  const coaches = await Api.coaches();
  const c2 = coaches.find((c) => c.id === 'c2'); // UTC-5
  const days = await Api.days();
  const day = days[0];
  const slots = await Api.slots('c2', day);
  const free = slots.filter((s) => s.available);

  check('slots: some free, some pre-taken', free.length > 0 && free.length < slots.length,
    `${free.length}/${slots.length} free`);

  // A1
  const s1 = await Api.book({
    coachId: 'c2', coachName: c2.name, tzOffset: c2.tzOffset, tzLabel: c2.tzLabel,
    date: day, hour: free[0].hour, duration: 60, notes: 'x'.repeat(400), guestEmail: ''
  });
  check('A1 timestamp stored as UTC instead of coach offset', s1.startsAt.endsWith('Z'), s1.startsAt);
  const shownHour = new Date(Date.parse(s1.startsAt) + c2.tzOffset * 3600000).getUTCHours();
  check('A1 displayed hour drifts by the offset', shownHour === free[0].hour + c2.tzOffset,
    `slot ${free[0].hour}:00 -> shown ${shownHour}:00`);

  // A5
  check('A5 notes truncated to 280 silently', s1.notes.length === 280, `len=${s1.notes.length}`);

  // A3
  const key = Store.slotKey('c2', day, free[0].hour);
  check('booking blocks the slot', Store.isBlocked(key));
  await Api.cancel(s1.id);
  check('A3 slot still blocked after cancel', Store.isBlocked(key));
  check('cancel sets status', Store.session(s1.id).status === 'cancelled');

  // B6
  const stale = Store.cachedUpcoming();
  if (Fx('fx_b6')) {
    check('B6 cached count not refreshed on cancel', stale === 1, `cached=${stale}, confirmed=0`);
  } else {
    check('B6 inactive: cached count refreshed', stale === 0, `cached=${stale}`);
  }

  // B2
  const s2 = await Api.book({
    coachId: 'c2', coachName: c2.name, tzOffset: c2.tzOffset, tzLabel: c2.tzLabel,
    date: day, hour: free[1].hour, duration: 60, notes: '', guestEmail: ''
  });
  const resched = await Api.reschedule(s2.id, days[1], free[2].hour);
  if (Fx('fx_b2')) {
    check('B2 reschedule forces 30 min', resched.duration === 30, `duration=${resched.duration}`);
  } else {
    check('B2 inactive: duration preserved', resched.duration === 60, `duration=${resched.duration}`);
  }

  // B5 — this is booking attempt 3
  let b5err = null;
  try {
    await Api.book({
      coachId: 'c2', coachName: c2.name, tzOffset: c2.tzOffset, tzLabel: c2.tzLabel,
      date: day, hour: free[3].hour, duration: 30, notes: '', guestEmail: 'alex@company'
    });
  } catch (e) { b5err = e.code; }
  if (Fx('fx_b5')) {
    check('B5 invalid guest email accepted', b5err === null, `err=${b5err}`);
  } else {
    check('B5 inactive: invalid email rejected', b5err === 'VALIDATION', `err=${b5err}`);
  }

  // failure injection: next book call is attempt 4
  let failCode = null;
  try {
    await Api.book({
      coachId: 'c2', coachName: c2.name, tzOffset: c2.tzOffset, tzLabel: c2.tzLabel,
      date: day, hour: free[4].hour, duration: 30, notes: '', guestEmail: ''
    });
  } catch (e) { failCode = e.code; }
  check('booking attempt #4 fails deterministically', failCode === 'SERVER_ERROR', `err=${failCode}`);

  // chat failure injection on message #3
  const codes = [];
  for (const msg of ['stress at work', 'my goals', 'third message']) {
    try { await Api.chat(msg); codes.push('ok'); } catch (e) { codes.push(e.code); }
  }
  check('chat message #3 fails deterministically',
    codes[0] === 'ok' && codes[1] === 'ok' && codes[2] === 'SERVER_ERROR', codes.join(','));
}

await run(1000);
await run(1234);

console.log('');
let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? '  [' + r.detail + ']' : ''}`);
}
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
