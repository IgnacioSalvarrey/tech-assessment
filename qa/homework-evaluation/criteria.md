# QA Homework — Evaluation Criteria

Companion rubric for [`../homework/assignment.md`](../homework/assignment.md). Ground truth
for every injected defect is in [`bug-catalog.md`](./bug-catalog.md) — **read it before
grading** and grade against the candidate's **seed**.

The homework has an objective core (did they find the 8 functional defects we planted?) and
a judgment core (are their reports, priorities and tests any good?). This rubric keeps the
two separate so a candidate who finds fewer bugs but reports and automates them
excellently is not automatically outranked by a bug-count maximiser — and vice versa.

---

## How to use this rubric

**Scoring scale (per area):**

| Score | Meaning |
|------:|---------|
| **4 — Strong** | Senior signal. Would trust them to own quality for a squad. |
| **3 — Acceptable** | Solid mid-level. Reasonable, mostly complete, minor gaps. |
| **2 — Weak** | Works but shallow. Missed obvious considerations. |
| **1 — Poor** | Doesn't work, unreproducible, or contradicts the brief. |
| **0 — Absent** | Not attempted. |

**Weighting:**

| # | Area | Weight |
|--:|------|-------:|
| 1 | Defect recall & accuracy | 20% |
| 2 | Bug report quality | 15% |
| 3 | Severity / priority judgment & risk reasoning | 10% |
| 4 | UX & accessibility findings | 15% |
| 5 | Cypress suite design | 15% |
| 6 | Assertion quality | 10% |
| 7 | Determinism & flake control | 10% |
| 8 | Communication (`TEST_PLAN.md`) | 5% |

**Golden rule:** a finding only counts if **we can reproduce it from their steps** on their
seed. Vague "booking is buggy sometimes" entries score nothing, no matter how correct the
underlying instinct was.

---

## Grading procedure (do this in order — ~45 min)

1. Look up their seed in `bug-catalog.md` → write down their **expected 8** (5 Tier A + 3
   Tier B).
2. Clear `localStorage`, open the app on their seed, and **reproduce each reported bug from
   their steps only**. Mark each: reproduced / not reproduced / not a bug / distractor.
3. Map their findings onto the catalogue → compute **recall = found / 8**.
4. Run their suite **three consecutive times** — Docker, exactly as the brief tells them:
   ```bash
   make start SEED=<their seed>
   make test  SEED=<their seed>   # ×3
   ```
   If they restructured the setup, follow the commands in their `README.md`. A submission that
   only runs after undocumented manual setup is a finding in Area 8, not a reason to stop.
   Record: pass/fail per run, which failures are their intentional known-defect tests, and
   any run-to-run variation (= flake).
5. `grep -rn "cy.wait(\s*[0-9]" cypress/` → count hard sleeps.
6. `grep -rn "\.skip\|\.only" cypress/` → skipped/pinned tests.
7. Read `TEST_PLAN.md` last, so their narrative doesn't colour the objective checks.

---

## Area 1 — Defect recall & accuracy (20%)

Objective, computed from step 3.

| Score | Bar |
|---|---|
| **4** | **7–8 of 8**, including **A1** (the timezone mismatch) and at least one of the "verify the outcome, not the toast" defects (**B3**) or the fan-out cases (**B1**/**B6**). Zero false positives. |
| **3** | **5–6 of 8**, A1 found, ≤1 false positive. |
| **2** | **3–4 of 8**, or found volume but missed A1, or ≥2 distractors reported as bugs. |
| **1** | **≤2 of 8**, or mostly unreproducible entries. |

Weighting notes:

- **A1 is the load-bearing defect.** It requires testing a non-UTC coach and comparing three
  screens. Missing it caps this area at 3 even with everything else found.
- **B3 is the seniority tell** — it can only be found by verifying that a session actually
  exists after a success message.
- Candidates who only test coaches with offset 0 (`c4`, `c7`, `c9`) will miss A1 entirely.
  Say so in feedback; it is a useful coaching point either way.
- Finding a defect **not** in the catalogue (real, reproducible) = bonus, see below.
- Reporting a documented build constraint (see distractors) as a functional bug = −0.5 per
  item, floor of one band.

---

## Area 2 — Bug report quality (15%)

Judge `BUG_REPORT.md` as if handing it to a developer with no context.

Checklist per entry: unique ID + title that names the symptom · severity **and** priority ·
environment **including their seed** · preconditions/state · numbered steps that work from
a clean state · **expected vs actual stated separately** · evidence · console output where
relevant.

- **4** — Every entry reproducible first try; expected result is *justified*, not asserted;
  evidence attached; suspected root cause where they had a view; no duplicates; groups
  symptoms of one cause under one bug (e.g. A1 + the confirmation-screen mismatch) instead
  of inflating the count.
- **3** — Reproducible, complete fields, thin on expected-result reasoning or evidence.
- **2** — Steps require guessing, or expected/actual blurred into one narrative, or no seed
  recorded.
- **1** — Unreproducible, no steps, or a screenshot dump with captions.

Red flag: **splitting one root cause into 5 bugs** to look thorough. Note it explicitly.

---

## Area 3 — Severity / priority judgment & risk reasoning (10%)

- Is **A1 Critical** (a member shows up at the wrong hour) and **A5/B5 Medium-ish**? Is
  **B3** treated as severe because it *hides* failure?
- Do severity and priority differ anywhere, **with a reason**? (e.g. "B6 is Medium severity
  but low priority — cosmetic counter, no data loss".)
- Is the risk assessment tied to **user impact × likelihood**, and does it name booking
  integrity as the top regression area?

**4** = calibrated, defended, distinguishes severity from priority, risk picks are the ones
we would pick. **3** = mostly calibrated, light reasoning. **2** = flat scale or
everything-is-Critical / everything-is-Medium. **1** = no severity, or inverted (a11y
contrast Critical while wrong-time booking is Low).

---

## Area 4 — UX & accessibility findings (15%)

Score against the 16-item list in `bug-catalog.md`. Do **not** require all of them.

- **4** — **≥8 substantive items** with user impact and a suggested fix, including the
  destructive-cancel-without-confirmation issue **and** at least two real a11y findings
  (keyboard-inaccessible slot tiles, missing focus trap/Escape, unlabelled chat input,
  contrast). Clearly separated from functional bugs. Bonus if they actually did a
  keyboard-only pass and a 320 px pass, or ran an a11y tool and interpreted (not dumped)
  the output.
- **3** — 5–7 items, mostly visual/copy, at least one a11y item, impact usually stated.
- **2** — ≤4 items, or generic opinions ("UI feels dated") with no user impact, or a11y
  ignored entirely.
- **1** — Absent, or merged indistinguishably into the bug report.

Reward correctly identifying the **date-format inconsistency + missing timezone** as a
systemic risk rather than cosmetic nitpicks.

---

## Area 5 — Cypress suite design (15%)

- **Respected the 6–10 spec cap** and can explain what they left out and why. Writing 30
  shallow tests is a **negative** here — it is the prioritization signal.
- **≥2 known-defect regressions asserting the correct behaviour** (so they fail), clearly
  labelled and mapped to `BUG-xx`. **Auto-cap at 2** if they instead codified the buggy
  behaviour as expected — that would lock the defect in, the worst possible QA habit.
- Structure: reusable steps/commands/page objects proportionate to the size; fixtures or
  helpers instead of copy-paste; readable test names describing behaviour.
- Selectors: uses `data-testid` where available; where absent, chooses stable anchors over
  brittle CSS chains — and **flags the gap** as feedback to engineering (the app deliberately
  has partial coverage).
- Not required: CI. Present and working = bonus.

**4** = all of the above, would merge into our repo. **3** = solid, some duplication or one
brittle area. **2** = works but copy-pasted, or spec count/labelling ignored. **1** = tests
don't run, or they asserted the buggy behaviour as correct.

---

## Area 6 — Assertion quality (10%)

- Asserts **outcomes and state**: session count, session time text, status badge, duration,
  result count, slot availability after cancel — not merely `should('exist')` /
  `should('be.visible')` on a container.
- Negative/boundary test is real (280 vs 281 chars, invalid email, whitespace-only message,
  the error path) rather than a second happy path in disguise.
- Guards against false passes: does a "booking succeeded" test verify the session appears in
  My sessions, or does it trust the toast? (**The B3 trap applies to their tests too** — a
  test that asserts only the toast would pass on a broken build.)

**4** = state-based, meaningful, false-pass-resistant. **3** = mostly behavioural, one or two
weak assertions. **2** = existence checks dominate. **1** = tests that cannot fail.

---

## Area 7 — Determinism & flake control (10%)

Objective, from steps 4–6.

- **Zero hard sleeps** (`cy.wait(1000)`); waits on state, aliases, or intercepts.
- **Handles the `localStorage` trap** — explicit state reset (`beforeEach` clearing
  `aceup.*`) or a design that tolerates accumulated state. A suite that passes once and
  fails on run 2 exposes exactly this.
- Specs **independent and order-independent**; no `.only`; no `.skip` used to hide failures.
- **Same results across all three runs** (their known-defect tests failing consistently is
  correct and expected).

**4** = 3/3 identical runs, no sleeps, deliberate state strategy explained. **3** = 3/3
identical but state handling implicit/lucky, or one sleep. **2** = one run differs, or
several sleeps, or order-dependent. **1** = flaky/won't run, or `.skip`ped failures.

---

## Area 8 — Communication (`TEST_PLAN.md`) (5%)

- Scope and **explicit non-coverage** with the residual risk named.
- Automated vs manual split, with reasoning (what is *worth* automating).
- How determinism was achieved (seed, state, waits).
- Testability feedback to engineering (missing `data-testid`, no timezone in the DOM,
  1.2 s toasts being unassertable, no loading states).
- Honest "with more time I would…".

**4** = reproducible + reasoned + candid about gaps. **3** = complete, light on trade-offs.
**2** = shallow or hard to follow. **1** = missing.

---

## Bonus signals (+, cap +1 band on the closest area)

- Found a **real defect not in the catalogue** (verify it first).
- Identified the **deterministic failure pattern** (booking attempt #4 / chat message #3)
  instead of calling it "random".
- Worked out that behaviour is seed-scoped and used that to make tests deterministic.
- Automated a11y checks (axe) with **interpreted** results.
- CI workflow running the suite.
- Testability PR-style suggestions (concrete `data-testid` proposals, a timezone attribute).
- Asked us a **good clarifying question** before starting (e.g. what the intended timezone
  contract is). We should treat this as positive, not as a lack of autonomy.

## Red flags (drag the score regardless of volume)

- Regression tests that assert the **buggy** behaviour as expected.
- `cy.wait(3000)` as the waiting strategy.
- `.skip` / `.only` left in, or tests deleted to make the suite green.
- Bug count padded with duplicates or with documented build constraints.
- No seed recorded anywhere → nothing is reproducible.
- Reports symptoms with **no** expected result stated.
- A suite that only passes on a fresh browser profile.
- Severity inflation across the board (everything Critical).
- Claims of "tested cross-browser / mobile" with no evidence.
- Copy-pasted AI output that contradicts the actual build (e.g. bugs that don't exist,
  references to screens we don't have) — check a couple of claims against reality.

---

## Seniority calibration

- **Junior / not yet:** finds 2–4 defects, mostly cosmetic; missed A1; reports lack expected
  results; tests are existence checks with hard sleeps.
- **Target (hire):** 5–6 of 8 including A1; reproducible reports with calibrated severity;
  5+ UX/a11y findings including the missing cancel confirmation; 6–10 clean Cypress specs
  with state-based waits, 2 labelled regressions, deterministic across 3 runs; a test plan
  that states what it did not cover.
- **Strong (senior signal):** 7–8 of 8 including **B3** found by verifying outcomes rather
  than trusting the UI; root-cause grouping (timezone/date-format as one systemic issue);
  keyboard + 320 px passes done; testability feedback to engineering; explains the
  localStorage/latency determinism problem before we point it out.
