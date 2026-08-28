# QA take-home assessment (internal)

Take-home for the **QA Engineer** role: a purpose-built web app with planted defects, an
exploratory-testing + reporting brief, and a Cypress automation brief. Candidate timebox is
**1 day**.

## Layout

| Path | Ships to candidate? | What it is |
|---|:---:|---|
| `PLAN.md` | no | design rationale, defect design, build order |
| `START-HERE.md` | **yes** | candidate quickstart (Docker-only) |
| `Makefile` | **yes** | `make start` / `make test` / `make stop` |
| `docker-compose.yml` | **yes** | nginx app on :4173 + `cypress/included:15.8.1` runner |
| `app/` | **yes** | the system under test (static site, no backend, seed-driven) |
| `homework/assignment.md` | **yes** | the candidate brief |
| `homework/starter/` | **yes** (without `node_modules/`) | working Cypress scaffold |
| `homework-evaluation/bug-catalog.md` | **no** | ground truth: every planted defect + seed→defect map |
| `homework-evaluation/criteria.md` | **no** | rubric, weights, grading procedure |
| `homework-evaluation/scorecard.md` | **no** | fill-in scorecard |
| `homework-evaluation/MANUAL-VERIFICATION.md` | **no** | pre-send checklist |
| `tools/bundle.sh` | **no** | one-candidate bundler: stamps the seed in, records the assignment |
| `homework-evaluation/reference/` | **no** | verification harnesses: `logic-harness.mjs` (plain `node`) and `verify.internal.cy.js` (Cypress) |

## Sending it out

```bash
make bundle SEED=2417 CANDIDATE=christiam
```

That is the whole hand-out path. It refuses to run without both arguments, refuses seed
`1000` (the app default — a candidate with no seed lands on it silently), refuses a seed
already present in `seeds.md`, stamps the seed into `assignment.md`, `START-HERE.md`, the
`Makefile`, `docker-compose.yml` and the starter scaffold, appends the candidate's row to
`seeds.md` (creating it from `seeds.example.md` on first use), and writes the zip.

Because the seed is stamped in, a bare `make start` is correct for that candidate — but
**still put the seed in the email**, and state it in the deliverables ask.

Pick the seed from the table in `homework-evaluation/bug-catalog.md`. If `app/` changed
since the last hand-out, verify it first:

```bash
node homework-evaluation/reference/logic-harness.mjs   # 24/24 expected
```

then walk the browser-only rows of `homework-evaluation/MANUAL-VERIFICATION.md`.

In the email: the seed, the timebox (1 day), the deliverables list, and the deadline.

## Grading

Follow the procedure at the top of `homework-evaluation/criteria.md` (reproduce their bugs
from their steps → compute recall against their seed → run their suite three times → read
their test plan last), then fill in `scorecard.md`.

## Local run

Same commands the candidate gets:

```bash
make start SEED=1000     # http://localhost:4173/index.html?seed=1000
make test  SEED=1000
make stop
```

Native fallback: `cd app && python3 -m http.server 4173 --bind 127.0.0.1`.
