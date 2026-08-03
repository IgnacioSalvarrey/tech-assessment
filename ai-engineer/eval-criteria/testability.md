# Testability

Evaluates separation of concerns that enables unit testing, and the quality of any tests the candidate provides.

---

## Structural Testability

These are assessed by reading the code, regardless of whether the candidate wrote tests:

- [ ] The service/use-case layer accepts the `LLm` port via constructor — it can be unit-tested by passing a mock `LLm` without starting a server or calling OpenAI
- [ ] The in-memory store is injected or accessible as a replaceable component — tests can use a fresh store per test
- [ ] Route handlers are thin (delegate to the service) — they do not need to be tested in isolation
- [ ] No `import openai` or `from app.adapters.openai import OpenAIAdapter` appears in the service or domain layer

---

## Tests Provided by the Candidate

- [ ] At least one unit test for the service layer using a mocked `LLm` port
- [ ] The mock implements the `LLm` abstract interface (not a `MagicMock` patching internal OpenAI calls)
- [ ] Tests cover the happy path (valid transcript → stored result returned)
- [ ] Tests cover at least one error path (empty transcript → error raised/returned)
- [ ] Test for `404` when retrieving a non-existent ID
- [ ] HTTP-level tests (e.g., FastAPI `TestClient` or Flask test client) are credited but not required — they complement, not replace, service-layer unit tests

---

## Test Quality

- [ ] Tests are isolated — no shared mutable state between test cases
- [ ] Test names describe the scenario being tested (e.g., `test_analyze_transcript_returns_id_and_summary`)
- [ ] Assertions are specific — not just `assert result is not None` but checking field values
- [ ] The existing integration test (`tests/adapters/test_openai.py`) is preserved and unmodified
- [ ] No tests require a real OpenAI API key to run (except the pre-existing integration test)

---

## Coverage Considerations

Not required to be 100%, but assess whether critical paths are tested:

| Path | Should be tested |
|---|---|
| Valid transcript analysis | Yes |
| Empty transcript rejection | Yes |
| Retrieve by valid ID | Yes |
| Retrieve by unknown ID | Yes |
| Concurrent analysis (if implemented) | Recommended |
