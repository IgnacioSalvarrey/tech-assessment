# AI Coding Usage

Evaluates whether the candidate intentionally leveraged AI coding tools (e.g., Claude Code, GitHub Copilot, Cursor, ChatGPT) during development, and how effectively they did so. Evidence of thoughtful AI-assisted development is rewarded; absence of any signal is penalized.

Look for signals in: `.claude/`, `CLAUDE.md`, `AGENTS.md`, `CURSORRULES`, `.github/copilot-instructions.md`, spec files, `prompts/`, `docs/`, commit messages, comments, and the README.

---

## Evidence of AI Tool Setup

- [ ] A project-level AI instruction file exists (e.g., `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `.github/copilot-instructions.md`)
- [ ] The instruction file gives the AI meaningful context about the project (architecture, conventions, constraints) — not just boilerplate
- [ ] Custom agents or skills were defined for recurring tasks (e.g., a test-running agent, a linting agent, a code-review agent)
- [ ] A `.claude/` directory (or equivalent) is present with agent definitions, settings, or hook configurations

---

## Quality of AI Instructions

- [ ] Instructions describe the project's architecture and key design constraints (e.g., hexagonal architecture, port/adapter pattern)
- [ ] Instructions specify coding conventions: naming style, type annotation requirements, preferred libraries
- [ ] Instructions define what the AI should and should not do (e.g., "do not modify files under `app/ports/`", "always use Pydantic models across layer boundaries")
- [ ] Instructions reference the existing skeleton files so the AI can orient itself quickly
- [ ] If agents are defined, each has a clear, scoped responsibility — not a single catch-all agent

---

## Spec-Driven or Prompt-Driven Development

- [ ] A spec file, task file, or structured prompt exists that describes what needs to be built before it was built (evidence of planning with AI, not just autocomplete)
- [ ] Prompts or specs are precise: they name endpoints, expected inputs/outputs, error cases, and constraints — not just "build a REST API"
- [ ] If multiple features were built, separate prompts or tasks exist for each (granular, iterative AI usage rather than one monolithic dump)
- [ ] The spec or prompt references the existing codebase (`LLm` port, `OpenAIAdapter`, `run_completion`) showing the candidate understood the skeleton before prompting

---

## Evidence of Iterative AI Use

- [ ] Commit history, comments, or documentation suggest the candidate used AI in a feedback loop — not just a single generation
- [ ] There is evidence of correction or refinement: a spec was updated, a prompt was revised, or a generated artifact was clearly edited by hand
- [ ] The candidate did not blindly accept AI output: the code shows judgment (e.g., AI-suggested patterns adapted to the project's specific constraints)

---

## Best-Practice Signals

- [ ] The candidate used AI to generate or scaffold tests, not just application code
- [ ] AI instructions include context about the test setup (integration test vs. unit test, the existing `mock_data.py` fixture)
- [ ] The candidate used AI to help write the README or documentation (evidence: structured, complete docs consistent with spec-driven prompting)
- [ ] No signs of naive AI misuse: no hallucinated imports left in the code, no references to non-existent files, no stale TODO comments that AI added but the candidate never resolved

---

## Scoring Guidance

| Level | Description |
|---|---|
| **High** | Clear AI instruction file with meaningful project context; agents or skills defined; spec/task files present; code quality is consistent with guided AI generation; evidence of iteration |
| **Medium** | Some AI tooling evidence (e.g., a minimal `CLAUDE.md`, or commit messages referencing AI), but instructions are thin or generic; no agents or specs; usage appears ad-hoc |
| **Low** | No instruction files, no agents, no specs; code may still be AI-assisted but there is no evidence of intentional, structured AI tool usage |
| **None** | No signals whatsoever — no config files, no comments, no structured prompts, no README patterns consistent with AI assistance |
