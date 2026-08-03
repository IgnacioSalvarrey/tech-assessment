# QA Homework — Scorecard

**Candidate:**
**Seed:**
**Reviewer / date:**
**Submission link:**

---

## 1. Defect recall (fill from `bug-catalog.md` for this seed)

| ID | Defect | Expected for this seed? | Reported? | Reproduced from their steps? | Notes |
|----|--------|:---:|:---:|:---:|---|
| A1 | Booked time ≠ selected slot | yes | | | |
| A2 | Double booking on repeat Confirm | yes | | | |
| A3 | Cancel doesn't free the slot | yes | | | |
| A4 | Whitespace-only chat message accepted | yes | | | |
| A5 | Notes silently truncated at 280 | yes | | | |
| B1 | Filter dropped on page 2 | | | | |
| B2 | Reschedule resets duration to 30 | | | | |
| B3 | Success toast on failed booking | | | | |
| B4 | Chat hangs after failed reply | | | | |
| B5 | Invalid guest email accepted | | | | |
| B6 | Stale dashboard count after cancel | | | | |

**Recall:** ______ / 8
**False positives:** ______
**Distractors reported as bugs:** ______
**Extra real defects found (not in catalogue):** ______

---

## 2. Suite verification

| Check | Result |
|---|---|
| `npm install` clean | |
| Spec count (cap 10) | |
| Run 1 (pass/fail per spec) | |
| Run 2 — identical to run 1? | |
| Run 3 — identical to run 1? | |
| Known-defect tests present, labelled, asserting **correct** behaviour | |
| `grep "cy.wait(<number>"` count | |
| `.only` / `.skip` present | |
| State reset strategy (`localStorage`) | |
| CI present (bonus) | |

---

## 3. Scores

| Area | Weight | Score (0–4) | Weighted | Notes |
|------|-------:|:-----------:|---------:|-------|
| 1. Defect recall & accuracy | 20% | | | |
| 2. Bug report quality | 15% | | | |
| 3. Severity / priority & risk | 10% | | | |
| 4. UX & accessibility findings | 15% | | | |
| 5. Cypress suite design | 15% | | | |
| 6. Assertion quality | 10% | | | |
| 7. Determinism & flake control | 10% | | | |
| 8. Communication (`TEST_PLAN.md`) | 5% | | | |
| **Bonus signals** | — | +____ | | |
| **Red flags** | — | | | |
| **Total** | 100% | | **/4** | |

---

## 4. Debrief notes

**Strongest signal:**

**Weakest signal:**

**Questions for the follow-up interview** (pick 2–3):

- Walk me through how you found *(their best bug)*. What made you look there?
- The booking confirmation and My sessions disagree about the time. Which one is wrong, and
  how would you prove it to the developer?
- Booking attempt #4 fails. Was that random? How would you find out?
- Your suite passes on the first run. How confident are you it passes on a colleague's
  machine tomorrow — and why?
- What would you have asked us before starting, if you could?
- You had one day. What did you deliberately not test, and what risk did that leave?

**Recommendation:** ☐ Strong hire ☐ Hire ☐ Lean hire (discuss) ☐ No hire

**One-line rationale:**
