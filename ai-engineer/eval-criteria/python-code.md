# Code Quality & Readability

Evaluates naming conventions, clarity, consistency, and general Python best practices.

---

## Naming

- [ ] Variables, functions, and methods use `snake_case`
- [ ] Classes use `PascalCase`
- [ ] Names are descriptive and unambiguous (e.g., `analyze_transcript` not `do_thing`, `transcript_store` not `data`)
- [ ] No single-letter variables outside of comprehensions or math expressions
- [ ] Constants are `UPPER_SNAKE_CASE` or encapsulated in a config/settings object

---

## Type Annotations

- [ ] All function signatures have parameter and return type annotations
- [ ] `Optional[X]` (or `X | None`) is used explicitly rather than leaving types implicit
- [ ] Pydantic models are used for structured data — no plain `dict` passed between layers

---

## Code Clarity

- [ ] Functions and methods do one thing — no large functions mixing validation, business logic, and storage
- [ ] No dead code or commented-out blocks left behind
- [ ] No hardcoded values (API keys, model names, URLs) outside of `configurations.py` or `.env`
- [ ] No magic strings for configuration values — error message literals are acceptable, but field names, route paths, and model identifiers should not be scattered as raw strings

---

## Python Best Practices

- [ ] Context managers (`with`) used where appropriate
- [ ] List/dict comprehensions preferred over imperative loops for simple transformations
- [ ] `pydantic.BaseModel` used for all structured data crossing layer boundaries (not raw dicts or dataclasses)
- [ ] No mutable default arguments (e.g., `def f(x=[])`)
- [ ] `__init__.py` files expose only what should be public from each package

---

## Consistency

- [ ] Consistent import ordering (standard library → third-party → local; or managed by a linter)
- [ ] Consistent use of single vs. double quotes throughout the codebase
- [ ] Consistent response model structure across endpoints (same field naming and shapes)
- [ ] `pyproject.toml` updated if new dependencies are added (not installed ad-hoc)
