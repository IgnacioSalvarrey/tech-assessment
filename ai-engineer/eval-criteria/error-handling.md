# Error Handling

Evaluates appropriate management of edge cases and meaningful, consistent error responses.

---

## Input Validation Errors

- [ ] Empty transcript string → `400 Bad Request` with a descriptive message (e.g., `"Transcript must not be empty"`)
- [ ] Whitespace-only transcript → treated as empty, returns `400`
- [ ] Missing required field in request body → `422 Unprocessable Entity` (FastAPI automatic default) or `400` (Flask or explicit handling); either is acceptable, but must not be `500`

---

## Not Found Errors

- [ ] Requesting a transcript ID that does not exist → `404 Not Found`
- [ ] The `404` response includes a meaningful message (e.g., `"Transcript with id '...' not found"`)
- [ ] The error is raised at the service layer, not checked in the route handler via `if result is None: return {}`

---

## Downstream / Adapter Errors

- [ ] If the OpenAI API call fails (e.g., network error, invalid key), the exception is caught and converted to a `500` response — not an unhandled crash
- [ ] The error response to the client does not expose internal details (stack traces, API keys) in production-style code
- [ ] Errors from the adapter are logged or surfaced in a structured way (even if just `print` for a simple implementation)

---

## Error Response Shape

- [ ] All error responses follow a consistent JSON structure (e.g., `{"detail": "message"}`)
- [ ] Success and error responses are clearly distinguishable by status code alone — no `200 OK` with `{"error": "..."}` in the body
- [ ] FastAPI's `HTTPException` (or equivalent) is used rather than manually constructing error response dicts

---

## Robustness

- [ ] The in-memory store is thread-safe or at least acknowledged as not thread-safe in a comment (relevant for concurrent endpoint)
- [ ] The service does not assume the LLM always returns a valid response — handles `None` or malformed responses gracefully
