# ML Tech Assessment Evaluator

This repo evaluates candidate submissions for the Python ML tech assessment. Candidate code lives in `candidates/<candidate-name>/` and results are written to `evaluation/<candidate-name>/`.

## Prerequisites

- [Claude Code](https://claude.ai/code) CLI installed and authenticated

## Running the Evaluation

Place the candidate's submission under `candidates/<candidate-name>/` (where `<candidate-name>` is a unique identifier for the candidate, e.g. `john-doe`).

Then ask Claude Code to run the evaluation in plain English. For example, type this in the Claude Code chat:

> Evaluate the candidate in candidates/\<candidate-name\>

Claude Code will invoke the orchestrator agent on your behalf. **Do not** type `/agent eval-orchestrator ...` — that syntax is not supported and will produce an error.

The orchestrator will:

1. Launch all 8 criteria sub-agents in parallel
2. Wait for all evaluations to complete
3. Read each result and compute a weighted score
4. Write a unified summary with a hiring recommendation

## Output

All results are written to `evaluation/<candidate-name>/`:

| File | Contents |
|------|----------|
| `summary.md` | Weighted score, criticality breakdown, and hiring recommendation |
| `eval-architecture.md` | Architecture & Code Structure (20%) |
| `eval-api-design.md` | API Design & Functionality (20%) |
| `eval-integration.md` | Integration with Provided Interfaces (15%) |
| `eval-error-handling.md` | Error Handling (15%) |
| `eval-testability.md` | Testability (15%) |
| `eval-python-code.md` | Code Quality & Readability (10%) |
| `eval-instructions.md` | Instructions & Documentation (5%) |
| `eval-async-processing.md` | Async Processing — optional bonus (+0.5 to final score) |

Start with `summary.md` — it links to each detailed report.

## Scoring

Criteria are weighted and combined into a final score out of 10. Each criterion is also classified by severity:

| Level | Score range | Meaning |
|-------|-------------|---------|
| Excellent | ≥ 9.0 | Exceeds expectations |
| Good | 7.0 – 8.9 | Meets expectations |
| Needs work | 4.0 – 6.9 | Significant gaps |
| Critical issue | < 4.0 | Blocks advancement |

Hiring thresholds applied in `summary.md`:

| Recommendation | Condition |
|----------------|-----------|
| STRONG HIRE | Score ≥ 8.5 and no critical issues |
| HIRE | Score ≥ 7.0 and no critical issues |
| BORDERLINE | Score ≥ 5.5 and at most 1 critical issue |
| NO HIRE | Score < 5.5 or ≥ 2 critical issues |

## Repository Structure

```
.
├── assessment/          # Git submodule — candidate skeleton (do not modify)
├── candidates/          # Place candidate submissions here
├── eval-criteria/       # Evaluation rubrics (source of truth for agents)
├── evaluation/          # Generated reports (one subfolder per candidate)
└── .claude/agents/      # Agent definitions
    ├── eval-orchestrator.md
    ├── eval-architecture.md
    ├── eval-api-design.md
    ├── eval-async-processing.md
    ├── eval-error-handling.md
    ├── eval-instructions.md
    ├── eval-integration.md
    ├── eval-python-code.md
    └── eval-testability.md
```
