# Internal verification (do not ship to candidates)

Two harnesses, in increasing cost:

| Harness | Needs | Covers |
|---|---|---|
| `logic-harness.mjs` | plain `node` | API-layer defects: **A1, A3, A5, B2, B5, B6**, the deterministic failure injection (booking #4, chat #3), slot seeding, and that inactive flags behave correctly |
| `verify.internal.cy.js` | Cypress binary | everything above **plus** the UI-layer defects that need a browser: **A2, A4, B1, B3, B4** |

## Logic harness (fast, run this after any `app/` change)

```bash
cd tech-assessment/qa
node homework-evaluation/reference/logic-harness.mjs   # expect 24/24 checks passed
```

It loads `app/assets/js/{seed,flags,store,api}.js` in a VM with stubbed
`window`/`localStorage`/`fetch` and latency removed, and runs both seed 1000 and 1234.

## Cypress harness (Docker — no local Cypress needed)

`verify.internal.cy.js` asserts that every planted defect still reproduces end-to-end. Tier B
assertions self-skip when the flag is not active for the seed under test (they show as fast
passes, tens of milliseconds).

```bash
cd tech-assessment/qa
make start
cp homework-evaluation/reference/verify.internal.cy.js homework/starter/cypress/e2e/
make test SEED=1000 ARGS="--spec cypress/e2e/verify.internal.cy.js"   # covers B1/B2/B5
make test SEED=1234 ARGS="--spec cypress/e2e/verify.internal.cy.js"   # covers B3/B4/B6
rm homework/starter/cypress/e2e/verify.internal.cy.js
rm -rf homework/starter/cypress/screenshots
```

Two seeds cover all six Tier B defects. **Last run: 11/11 passing on both seeds.**

**Always delete the spec from `homework/starter/` afterwards** — it must never end up in a
candidate bundle.

> The Cypress binaries cached under `~/Library/Caches/Cypress/*` on this machine are stubs
> (69 KB launcher, no Electron payload), so a *native* `npx cypress run` fails at startup.
> Use Docker as above, or repair the cache with `npx cypress install --force`.

## Rules

- Never copy this file into a candidate bundle. Ship only `app/` and `homework/`
  (and `homework/starter/` **without** `node_modules/`).
- Re-run both after any change to `app/` — together they are the regression suite for the
  assessment itself.
- `logic-harness.mjs` intentionally reads the app source directly, so it breaks loudly if the
  flag names or API shape change.
