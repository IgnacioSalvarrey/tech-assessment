# Asynchronous Processing (Optional / Bonus)

Evaluates correct use of `asyncio` for concurrent transcript analysis without blocking the main thread. This criterion applies only if the candidate implemented Point 2 of the assessment.

---

## Endpoint Design

- [ ] A distinct endpoint exists for multi-transcript analysis (not overloading the single-transcript endpoint)
- [ ] The endpoint accepts a list/array of transcript texts in a single request
- [ ] The response contains a list of results, each with `id`, `summary`, and `action_items`
- [ ] The endpoint returns only after all analyses are complete (or documents a polling/callback alternative)

---

## Correct Use of asyncio

- [ ] `asyncio.gather()` (or equivalent) is used to run multiple `run_completion_async()` calls concurrently
- [ ] The async adapter method `run_completion_async()` is called — not the synchronous `run_completion()` wrapped in `asyncio.run()` or `loop.run_in_executor()`
- [ ] The route handler is declared `async def` when using `await`
- [ ] No `time.sleep()` or blocking I/O inside an async context (use `await asyncio.sleep()` if needed in tests)

---

## Non-Blocking Behavior

- [ ] The main thread is not blocked during concurrent analysis — concurrent requests can be handled while analysis is in progress
- [ ] `asyncio.gather()` is used rather than sequential `await adapter.run_completion_async()` calls in a loop (which would be sequential, not concurrent)
- [ ] Each transcript analysis is independently awaited — a failure in one does not prevent others from completing (e.g., using `return_exceptions=True` or per-task error handling)

---

## Error Handling in Async Context

- [ ] If one transcript in the batch fails (e.g., empty string or API error), the others still complete
- [ ] Exceptions from `asyncio.gather()` are handled — not left to propagate as unhandled coroutine exceptions
- [ ] (Bonus) Partial failures return a structured response indicating which analyses succeeded and which failed — not required by the assessment, award as extra credit

---

## Integration with Architecture

- [ ] The async path uses the same service and storage layer as the sync path (no code duplication)
- [ ] The in-memory store handles concurrent writes without race conditions (e.g., using a dict which is GIL-protected in CPython, or a proper lock for more complex stores)
- [ ] All results from the concurrent batch are stored and retrievable by ID via the existing GET endpoint
