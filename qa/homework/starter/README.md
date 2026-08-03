# Cypress starter — AceUp QA assessment

Minimal, working Cypress setup for the assignment. Extend it; you may restructure it
if you explain why in your `TEST_PLAN.md`.

## Run it (Docker — nothing to install)

From the **bundle root**, two levels up:

```bash
make test                                       # all specs, headless
make test SEED=1234                             # against your seed
make test ARGS="--spec cypress/e2e/smoke.cy.js" # one spec
make test.open                                  # interactive (needs local Node 20+)
```

The container mounts this folder, so it always runs your current working copy.
**`make test` is what we run when reviewing your submission** — make sure it passes there.

## Run it natively (optional)

Needs Node 20+:

```bash
npm install
npm run serve     # serves ../../app at http://localhost:4173
npm run cy:open   # interactive
npm run cy:run    # headless
npm run e2e       # serve + headless run in one command
SEED=1234 npm run e2e
```

(The `/// <reference types="cypress" />` type error in your editor disappears after
`npm install`.)

## Your seed

The suite reads it from `Cypress.env('seed')`. `make test SEED=…` and `SEED=… npm run e2e`
both set it; you can also edit `env.seed` in `cypress.config.js`.

## What's provided

- `cypress.config.js` — `baseUrl`, **`retries: 0`** (deliberate: we want to see a
  deterministic suite, not one propped up by retries), video off. In Docker the `baseUrl` is
  overridden to the app container; keep using relative paths and `cy.visitApp` and it works
  both ways.
- `cypress/support/commands.js` — `cy.visitApp(path, query?)`, which keeps your seed on
  the URL.
- `cypress/e2e/smoke.cy.js` — two passing tests so you can verify the setup.

## Things worth knowing

- The app stores booked sessions in `localStorage` (`aceup.state.<seed>`), so state
  survives page loads. How you deal with that in a test suite is your call.
- The fake API adds 200–900 ms of latency to every request.
- Some elements have `data-testid`, others do not. Note anywhere the app made you write
  a selector you are not happy with — that feedback is part of what we grade.
