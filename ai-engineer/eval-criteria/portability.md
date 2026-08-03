# Portability & Environment Isolation

Evaluates whether the candidate has applied container-based best practices for reproducible local development, host isolation, and CI/CD-friendly test execution.

---

## Container-Based Local Development

- [ ] A `Dockerfile` is provided that builds a runnable image of the application
- [ ] The `Dockerfile` pins the base image to a specific version (e.g., `python:3.12-slim`, not `python:latest`)
- [ ] The `Dockerfile` installs dependencies from `pyproject.toml` / `poetry.lock` (or equivalent lock file) — not from a loosely specified `requirements.txt` without pins
- [ ] A `docker-compose.yml` (or `compose.yaml`) is provided for local development — a developer can start the full stack with a single command (`docker compose up`)
- [ ] The `.env` file (or its variables) is injected via `env_file` or `environment` in the Compose file — secrets are not baked into the image
- [ ] The application port is explicitly mapped (`ports:`) so the API is reachable from the host without modification

---

## Host Isolation

- [ ] The application runs entirely inside the container — no instructions require the developer to install Python, Poetry, or any tool on their host machine to run the app
- [ ] The `Dockerfile` uses a non-root user to run the application process
- [ ] Build artefacts and cache directories (e.g., `__pycache__`, `.pytest_cache`, `dist/`) are excluded via `.dockerignore`
- [ ] Source code is either copied into the image (for production-style builds) or mounted via a volume (for development hot-reload) — the approach is explicit and intentional

---

## Containerised Test Execution

- [ ] Tests can be run inside a container without requiring a local Python environment (e.g., `docker compose run --rm app pytest` or a dedicated `test` service in Compose)
- [ ] Unit and service-layer tests (those that do not call the real OpenAI API) run fully offline inside the container — no external network calls required
- [ ] The integration test (`tests/adapters/test_openai.py`) is either excluded from the default container test run or documented as requiring the `OPENAI_API_KEY` variable to be injected at runtime
- [ ] A dedicated Compose service or `Dockerfile` target (e.g., multi-stage `test` stage) is provided for running the isolated test suite

---

## CI/CD Readiness

- [ ] A CI configuration file is present (e.g., `.github/workflows/`, `Jenkinsfile`, `.gitlab-ci.yml`) or the README explicitly documents the commands a CI pipeline should run
- [ ] The containerised test command is documented and copy-pasteable — a CI system can execute it without additional setup beyond injecting secrets
- [ ] The CI/test workflow does not depend on host-installed tools beyond Docker and `docker compose`
- [ ] If a multi-stage `Dockerfile` is used, the `test` stage is separated from the `runtime` stage so the final image does not include test dependencies

---

## `.gitignore` Quality

- [ ] A `.gitignore` file is present at the repository root
- [ ] Python-specific artefacts are excluded: `__pycache__/`, `*.pyc`, `*.pyo`, `*.pyd`, `.pytest_cache/`, `*.egg-info/`, `dist/`, `build/`
- [ ] Virtual environment directories are excluded (e.g., `.venv/`, `venv/`, `env/`, `.conda/`)
- [ ] The `.env` file (containing secrets) is excluded — it must never be committed
- [ ] IDE and OS noise is excluded (e.g., `.idea/`, `.vscode/`, `.DS_Store`, `Thumbs.db`)
- [ ] Container-related artefacts are excluded where applicable (e.g., `.docker/`, volume mount directories)
- [ ] Coverage and test output artefacts are excluded (e.g., `.coverage`, `htmlcov/`, `coverage.xml`)
- [ ] The `.env.example` or equivalent placeholder file is **not** excluded — it should be committed as documentation

---

## Reproducibility

- [ ] A lock file is committed (`poetry.lock`, `requirements.txt` with pinned versions, etc.) so dependency resolution is deterministic
- [ ] The Python version inside the container matches the version declared in `pyproject.toml` (`^3.12`)
- [ ] Environment variable names required at runtime are documented (even if values are not committed), either in the README or in a `.env.example` file
- [ ] Running `docker compose up` (or equivalent) twice from a clean checkout produces an identical, working environment — no manual steps are required between a fresh clone and a running application
