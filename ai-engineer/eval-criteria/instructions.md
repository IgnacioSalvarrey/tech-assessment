# Instructions & Documentation Quality

Evaluates the precision, completeness, and clarity of the candidate's `README.md` (or equivalent documentation delivered with the submission).

---

## Setup Instructions

- [ ] Lists all prerequisites (Python version, Conda/venv, Poetry or pip, etc.)
- [ ] Specifies the exact Python version required (must match `pyproject.toml`: 3.12)
- [ ] Provides the exact commands to create and activate the environment — copy-pasteable, no ambiguity
- [ ] Documents the `.env` file requirement: which variables are needed (`OPENAI_API_KEY`, `OPENAI_MODEL`) and their expected format
- [ ] Dependency installation command is explicit (e.g., `poetry install`, not just "install dependencies")

---

## Running the Application

- [ ] Provides the exact command to start the server (including module path, host, and port)
- [ ] States the default base URL where the server will be accessible
- [ ] Documents any required startup flags or environment-specific options
- [ ] If the app requires a specific working directory, this is stated explicitly

---

## Running the Tests

- [ ] Provides the exact command to run the full test suite (`pytest`, `poetry run pytest`, etc.)
- [ ] Notes that the integration test (`tests/adapters/test_openai.py`) requires a valid `OPENAI_API_KEY`
- [ ] Documents how to run a single test file or test in isolation
- [ ] Documents how to generate a coverage report if coverage tooling was added

---

## API Usage

- [ ] Documents each endpoint: method, path, request body/parameters, and response shape
- [ ] Includes at least one working `curl` example per endpoint
- [ ] The `curl` examples use realistic, non-trivial input (not just `"test"` as the transcript)
- [ ] Response field names in the examples match the actual API response (no copy-paste inconsistencies)
- [ ] Documents the error responses: what triggers a `400`, `404`, etc., and what the body looks like
- [ ] References the Swagger URL (e.g., `http://127.0.0.1:8000/docs`) for interactive exploration

---

## Architectural Decisions

- [ ] Briefly explains the chosen framework (FastAPI/Flask) and why
- [ ] Describes the layer structure added by the candidate (e.g., service layer, router, repository)
- [ ] Notes any deliberate design choices that deviate from the obvious path (e.g., using `POST` instead of `GET` for analysis, a specific storage strategy)
- [ ] If the optional async endpoint was implemented, it is described separately with its own usage example

---

## Clarity & Precision

- [ ] Commands are wrapped in code blocks — not described in prose
- [ ] No ambiguous phrasing like "configure accordingly" or "set up as needed" without specifics
- [ ] Instructions are ordered logically: setup → run → test → use
- [ ] The document is self-contained: a reviewer with no prior context can follow it from start to finish without asking questions
