# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is an evaluation repo for a Python ML tech assessment. The `assessment/` directory is a Git submodule containing the candidate's code (or the provided skeleton). The `eval-criteria/` directory holds evaluation rubrics.

## Setup

```bash
conda create -n ml-assessment python=3.12
conda activate ml-assessment
pip install poetry
cd assessment
poetry install
```

Requires a `.env` file inside `assessment/` with `OPENAI_API_KEY` and `OPENAI_MODEL`.

## Commands (run from `assessment/`)

```bash
pytest                # Run all tests
pytest -v             # Verbose
pytest --cov          # With coverage
pytest tests/adapters/test_openai.py  # Single test file
```

## Architecture

The project uses **hexagonal (clean) architecture**:

- `app/ports/llm.py` — Abstract `LLm` interface with `run_completion(system_prompt, user_prompt, dto)` returning a Pydantic model instance
- `app/adapters/openai.py` — `OpenAIAdapter` implements `LLm`; also exposes `run_completion_async()` for concurrent use
- `app/configurations.py` — Pydantic-settings config (reads `.env` for `OPENAI_API_KEY`, `OPENAI_MODEL`)
- `app/prompts.py` — Hardcoded system and user prompts for transcript analysis
- `tests/adapters/mock_data.py` — Sample transcript and prompts; serves as documentation for prompt structure

## Assessment Task

The candidate must implement a web API (FastAPI or Flask) on top of the provided skeleton:

1. **POST/GET endpoint** — accepts a transcript, validates it's non-empty, calls `OpenAIAdapter`, stores result in memory, returns `{id, summary, action_items}`
2. **GET by ID endpoint** — retrieves a stored analysis
3. **(Optional)** Concurrent multi-transcript endpoint using `run_completion_async()` and asyncio

The `LLm` port interface must not be modified. The adapter must be injected (not instantiated inside business logic) to maintain layer separation.

## Key Design Constraints

- The DTO passed to `run_completion()` defines the structured output schema — candidates must define their own response DTO (e.g., `TranscriptAnalysis(BaseModel)` with `summary: str` and `action_items: list[str]`)
- The existing test (`tests/adapters/test_openai.py`) is an integration test that calls the real OpenAI API — it is provided as documentation, not to be modified
- Layer coupling is a key evaluation criterion: service/use-case layer should depend only on the `LLm` port, not on `OpenAIAdapter` directly

## Evaluation Tooling

Candidate submissions are evaluated using Claude Code sub-agents defined in `.claude/agents/`.

### Agents

- **`eval-orchestrator`** — runs all 10 criteria agents in parallel, computes a weighted score, and writes a summary with a hiring recommendation
- **`eval-architecture`**, **`eval-api-design`**, **`eval-integration`**, **`eval-error-handling`**, **`eval-testability`**, **`eval-python-code`**, **`eval-portability`**, **`eval-instructions`**, **`eval-ai-coding-usage`**, **`eval-async-processing`** — one agent per criterion

Each sub-agent reads its rubric from the corresponding file in `eval-criteria/` at runtime. **Do not copy criteria content into agent files** — the `eval-criteria/` files are the single source of truth.

### Running an Evaluation

Place the candidate's submission under `candidates/<candidate-name>/`, then run:

```
/agent eval-orchestrator candidates/<candidate-name>
```

### Results

Reports are written to `evaluation/<candidate-name>/`. Start with `summary.md` for the weighted score and hiring recommendation; each detailed `eval-<criterion>.md` is linked from there.
