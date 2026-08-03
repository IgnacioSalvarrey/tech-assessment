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
| `homework-evaluation/reference/` | **no** | verification harnesses: `logic-harness.mjs` (plain `node`) and `verify.internal.cy.js` (Cypress) |

## Sending it out

1. Pick a seed for the candidate (see `homework-evaluation/bug-catalog.md` for the
   seed → defect table) and record it in a private `seeds.md` — copy `seeds.example.md`.
2. If `app/` changed since the last hand-out, verify it:
   ```bash
   node homework-evaluation/reference/logic-harness.mjs   # 24/24 expected
   ```
   then walk the browser-only rows of `homework-evaluation/MANUAL-VERIFICATION.md`.
3. Bundle **only** the candidate-facing files:
   ```bash
   cd tech-assessment/qa
   zip -r ../aceup-qa-homework.zip \
     START-HERE.md Makefile docker-compose.yml app homework \
     -x '*/node_modules/*' '*/.DS_Store' '*/cypress/screenshots/*' '*/cypress/videos/*'
   ```
4. In the email: the seed, the timebox (1 day), the deliverables list, and the deadline.

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
