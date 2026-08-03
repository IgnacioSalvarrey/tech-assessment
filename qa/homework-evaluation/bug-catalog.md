# Bug catalogue — GROUND TRUTH (internal only)

**Never send this to a candidate.** Distribute only `app/` and `homework/`.

Every defect is gated by a flag in `app/assets/js/flags.js`. **Tier A (`fx_a1`–`fx_a5`) is
on for every seed.** Exactly **3 of the 6 Tier B** flags are enabled per seed, chosen by a
deterministic shuffle of the seed — so recall is comparable across candidates while the
"answer key" does not transfer between them.

Recall denominator = **5 Tier A + 3 Tier B = 8 functional defects**.

---

## Seed → Tier B mapping

Verified against the shuffle in `flags.js`.

| Seed | Active Tier B |
|---|---|
| 1000 (default) | `fx_b1`, `fx_b2`, `fx_b5` |
| 1234 | `fx_b3`, `fx_b4`, `fx_b6` |
| 2417 | `fx_b1`, `fx_b4`, `fx_b6` |
| 3391 | `fx_b2`, `fx_b3`, `fx_b5` |
| 4820 | `fx_b2`, `fx_b3`, `fx_b4` |
| 5573 | `fx_b3`, `fx_b4`, `fx_b5` |
| 7391 | `fx_b1`, `fx_b5`, `fx_b6` |
| 9057 | `fx_b1`, `fx_b3`, `fx_b4` |

Recompute for any other seed:

```bash
node -e '
function mulberry32(a){return function(){a|=0;a=(a+0x6d2b79f5)|0;var t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}
var seed=Number(process.argv[1]);var rand=mulberry32(seed+7919);
var pool=["fx_b1","fx_b2","fx_b3","fx_b4","fx_b5","fx_b6"];
for(var i=pool.length-1;i>0;i--){var j=Math.floor(rand()*(i+1));var t=pool[i];pool[i]=pool[j];pool[j]=t;}
console.log(pool.slice(0,3).sort().join(" "));' 7391
```

Keep the candidate → seed assignment in a private `seeds.md` (not committed).

---

## Deterministic infrastructure (not defects — but candidates may report them)

| Behaviour | Where | Expected candidate handling |
|---|---|---|
| Latency 200–900 ms on every call | `api.js` `delay()` | Should drive them to state-based waits |
| **Booking attempt #4 returns a server error** | `api.js` `BOOK_FAILS_ON_ATTEMPT` | Legitimate error path. Without `fx_b3` it surfaces a generic "Something went wrong" toast — reporting *the generic message* is a valid UX finding. Reporting "booking randomly fails" as a functional bug is acceptable-but-shallow (it is reproducible on the 4th attempt; a strong candidate finds the pattern). |
| **Chat message #3 returns a server error** | `api.js` `CHAT_FAILS_ON_MESSAGE` | Same. With `fx_b4` it becomes the hang defect. |
| Slot availability seeded via `preTaken()` | `api.js` | Grid identical on every run for a seed |
| State in `localStorage` under `aceup.state.<seed>` | `store.js` | Isolation trap for the suite |

---

## Tier A — always on

### A1 · `fx_a1` — Booked time does not match the selected slot
**Severity: Critical** (data integrity, member misses the session)
- **Code:** `api.js` `book()` / `reschedule()` — the timestamp is written with a `Z`
  suffix instead of the coach's UTC offset; `ui.js` `sessionTime()` renders it back in the
  coach's timezone.
- **Repro:** Coaches → pick a coach with a non-zero offset (e.g. **Daniel Whitfield**,
  `c2`, UTC−5) → Booking → select any available slot (e.g. **10:00 AM**) → Continue →
  confirmation modal shows **10:00 AM** → Confirm → **My sessions** shows **5:00 AM**
  (selected hour minus the coach's offset). Dashboard "Next session"
  agrees with My sessions, so the confirmation screen is the odd one out.
- **Not reproducible** on coaches with offset 0 (`c4`, `c7`, `c9`) — a candidate who only
  tests a UTC coach will miss it. Note that in the debrief.
- **Correct behaviour:** the same wall-clock time on the slot grid, the confirmation, the
  dashboard and My sessions.
- **Strong signal:** links it to the missing timezone label and the inconsistent date
  formats as a systemic "we never state the timezone" problem.

### A2 · `fx_a2` — Double booking via repeated Confirm clicks
**Severity: High**
- **Code:** `booking.html` `bookNow()` — the confirm button is only disabled when the flag
  is off, so there is no in-flight guard.
- **Repro:** Booking → select a slot → Continue → click **Confirm booking** twice within
  ~1 s → My sessions lists **two confirmed sessions** for the same coach, day and time.
- **Correct behaviour:** button disabled while the request is in flight; one session.
- Automation-friendly (`.click().click()`); a good regression test asserts session count.

### A3 · `fx_a3` — Cancelling a session does not free the slot
**Severity: High**
- **Code:** `api.js` `cancel()` — `unblock()` only runs when the flag is off.
- **Repro:** Book an available slot with a coach → My sessions → **Cancel** → back to that
  coach's booking page, same day → the slot you just freed is still greyed out and
  unselectable. Persists after reload.
- **Correct behaviour:** the slot returns to available.

### A4 · `fx_a4` — Whitespace-only chat message is accepted
**Severity: Medium**
- **Code:** `chat.html` `submit()` — validates `raw.length` instead of `raw.trim().length`.
- **Repro:** AI coach → type three spaces → Enter (or the send button) → an empty user
  bubble is added and Ally generates a reply. Truly empty input is correctly ignored.
- **Correct behaviour:** whitespace-only input is rejected, no request sent.

### A5 · `fx_a5` — Session notes silently truncated at 280 characters
**Severity: Medium**
- **Code:** `booking.html` `initNotes()` (no counter, no `maxlength` when the flag is on) +
  `api.js` `book()` (`slice(0, NOTES_LIMIT)`).
- **Repro:** Booking → Continue → paste > 280 characters into "What do you want to work
  on?" → Confirm → My sessions shows the note cut mid-word, with no warning, no counter
  and no error.
- **Correct behaviour:** a visible limit/counter, or an explicit validation message — never
  silent data loss.
- **Bonus:** exactly-280 vs 281 boundary testing.

---

## Tier B — seed-selected (3 of 6)

### B1 · `fx_b1` — Specialty/language filter is dropped on page 2
**Severity: High**
- **Code:** `coaches.html` `render()` — the page count is derived from the **unfiltered**
  list, and for `page > 1` the slice also comes from the unfiltered list, while the result
  count still reports the filtered total.
- **Repro:** Coaches → Specialty = **Leadership** → "3 coaches found" but the pager reads
  **"Page 1 of 3"** and **Next** is enabled → click **Next** → page 2 lists coaches that do
  not match the filter (Wellbeing, Career…). The count still says 3.
- **Correct behaviour:** pagination operates on the filtered set — with 3 results and a page
  size of 4 there should be exactly one page and Next should be disabled.
- Two visible symptoms (impossible page count, wrong results) from one cause — a strong
  candidate reports it as **one** bug.

### B2 · `fx_b2` — Reschedule silently resets duration to 30 minutes
**Severity: High**
- **Code:** `api.js` `reschedule()` — forces `duration: 30`.
- **Repro:** Book a **60 minute** session → My sessions (shows "60 min") → **Reschedule** →
  pick another day/time → Save → the row now reads **30 min**. No warning.
- **Correct behaviour:** duration is preserved.

### B3 · `fx_b3` — Success toast shown when booking actually failed
**Severity: Critical**
- **Code:** `booking.html` `bookNow()` catch branch — on `SERVER_ERROR` it closes the modal
  and shows "Session booked!" without creating anything.
- **Repro:** Make **four** booking attempts with the same seed/state (the 4th request fails
  server-side, see `BOOK_FAILS_ON_ATTEMPT`) → the UI reports "Session booked!" → My
  sessions has **no** 4th session and the slot is still free.
- **Correct behaviour:** an error state that lets the member retry.
- **Strong signal:** notices the missing session rather than trusting the toast — i.e. they
  verify outcomes, not messages. This is the single best senior indicator in the build.

### B4 · `fx_b4` — Chat hangs forever after a failed reply
**Severity: High**
- **Code:** `chat.html` catch branch returns early, leaving `busy(true)`.
- **Repro:** AI coach → send **3** messages → on the 3rd, "Ally is typing…" stays forever
  and the input and send button remain disabled. Only a reload recovers, and no error is
  shown.
- **Correct behaviour:** clear the indicator, re-enable the input, surface a retry.

### B5 · `fx_b5` — Invalid guest email accepted
**Severity: Medium**
- **Code:** `api.js` `book()` — the email regex check is skipped when the flag is on.
- **Repro:** Booking → Continue → guest = `alex@company` (or `a@b`, `alex@company.`) →
  Confirm → booking succeeds. With the flag off the same input is rejected with "Guest
  email is not valid."
- **Correct behaviour:** rejected, inline, before submit.
- Note: the field is `type="email"` but is not inside a `<form>`, so the browser never
  validates it — worth mentioning if the candidate does.

### B6 · `fx_b6` — Dashboard upcoming count is stale after cancelling
**Severity: Medium**
- **Code:** `api.js` `cancel()` skips the `cachedUpcoming()` refresh; `index.html` renders
  the cached value.
- **Repro:** Book 2 sessions → Dashboard shows **2** → My sessions → Cancel one → Dashboard
  still shows **2** (survives reload; only a new booking corrects it) while "Next session"
  and the list are correct.
- **Correct behaviour:** the counter is derived from live state.

---

## UX / accessibility issues (report-only — no functional assertion expected)

Graded in rubric Area 4. Not exhaustive; credit anything defensible with a stated user impact.

1. **Destructive cancel has no confirmation and no undo** (`sessions.html`) — highest-value
   finding here.
2. **Toasts auto-dismiss after 1.2 s** (`ui.js` `toast()`) and are the only channel for
   errors — easily missed entirely.
3. **Slot tiles are `<div>` with click handlers** — not focusable, no keyboard activation,
   no `aria-pressed`, no visible focus ring. Keyboard-only users cannot book.
4. **Unavailable slots look disabled but are still clickable** and clicking them gives no
   feedback at all.
5. **Modals**: no focus trap, no `Escape` to close, backdrop click does nothing, focus is
   never moved into the dialog, background still scrolls, no `aria-modal`.
6. **Chat input has no label**; the send button is an unlabelled glyph (no accessible name).
7. **Contrast failures**: `.hint` (`#b6bcc6`) and `.slot.taken` (`#d3d6dc`) are well below
   4.5:1 — and `.hint` carries real content (coach bios, session notes, the notes counter).
8. **Inconsistent date formats**: `MM/DD/YYYY` on the dashboard and booking summary vs
   `DD/MM/YYYY` in My sessions and the reschedule picker. Ambiguous, and compounds A1.
9. **Timezone is never displayed** next to any time, anywhere. Root-cause adjacent to A1.
10. **No empty state** in the coach directory when filters match nothing — just a blank area
    under "0 coaches found".
11. **No loading indicators anywhere** despite 200–900 ms latency (lists and grids appear
    blank, buttons look inert) — related to A2.
12. **Generic "Something went wrong"** with no cause, no retry affordance, no error id.
13. **Tap targets below 44 px** (`.btn-sm`: Reschedule, Cancel, Prev/Next, Regenerate).
14. **Horizontal overflow / unusable layout below ~360 px**; no responsive breakpoints;
    3-column stat grid and 2-column coach list never collapse.
15. **"Regenerate" duplicates the user's message** into the log instead of only regenerating
    the answer (arguably functional — accept in either report; do **not** double-count).
16. Page `<title>`s are fine but there is **no `<main>` landmark labelling, no skip link**,
    and headings are used for styling in places.

---

## Deliberate distractors (should **not** be reported as bugs)

Reporting these as functional defects is a (mild) negative — they are documented in
`app/README.md` as build constraints:

- No login / always "Alex Rivera"
- Only the next 7 days are bookable
- "Sessions completed 8" and "Program progress 62%" are static
- The Ally suggestion card is static copy
- Ally's replies are scripted keyword matches (not a real model)
- Nav links other than the five screens do not exist
