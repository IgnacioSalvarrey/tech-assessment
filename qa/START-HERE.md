# Start here

**Prerequisite: Docker.** That's it — no Node, no npm, no Cypress install.

```bash
make start          # app on http://localhost:4173
make test           # runs the Cypress suite, headless, in Docker
make stop
```

`make` on its own lists every command.

## 1. Your seed

Your assignment email contains a **build seed**. Use it everywhere:

```bash
make start SEED=1234        # prints the URL with your seed applied
make test  SEED=1234        # runs the suite against your seed
```

Then open the URL it prints, e.g. <http://localhost:4173/index.html?seed=1234>.

The seed makes the app **deterministic**: same seed, same data, same behaviour, every run.
The app remembers it while you navigate, so it only needs to be on the first URL you open.
Always state your seed in your report.

## 2. What to read

| File | What it is |
|---|---|
| `homework/assignment.md` | **the brief** — start here |
| `app/README.md` | the app under test: screens, how to reset your data |
| `homework/starter/README.md` | the Cypress scaffold you extend |

## 3. Running the tests

```bash
make test                       # all specs
make test ARGS="--spec cypress/e2e/booking.cy.js"
make test SEED=1234
```

The container mounts `homework/starter/`, so it runs **your** specs from your working copy —
nothing to rebuild between runs.

Want the interactive Cypress runner? Docker can't open a GUI, so that one path needs Node
20+ locally:

```bash
make test.open      # npm install + cypress open, natively
```

Everything else works with Docker alone, and `make test` is what we will run when we review
your submission.

## 4. Resetting your data

Booked sessions live in the browser's `localStorage`. To get back to a clean slate, run this
in the browser console:

```js
Object.keys(localStorage).filter(k => k.startsWith('aceup.')).forEach(k => localStorage.removeItem(k));
```

## 5. Troubleshooting

| Symptom | Fix |
|---|---|
| `port is already allocated` | something else uses 4173 — stop it, or change the port mapping in `docker-compose.yml` |
| Empty coach list / empty slot grid | you opened the HTML file directly; the app must be served over HTTP (`make start`) |
| First `make test` is slow | it's pulling the Cypress image once (~1 GB); later runs are fast |
| Screenshots owned by `root` after a failed run | expected on Linux hosts; `make clean` removes them |

If something looks broken in the **tooling** (not in the app), tell us — that's feedback we
want, and it doesn't count against you.
