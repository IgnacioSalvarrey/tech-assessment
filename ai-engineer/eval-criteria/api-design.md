# API Design & Functionality

Evaluates correctness and completeness of the HTTP endpoints, input validation, status codes, and Swagger documentation.

---

## Endpoints

### Analyze Transcript
- [ ] Endpoint exists and accepts a transcript (text payload)
- [ ] Returns a response containing: unique `id`, `summary`, and `action_items` (list)
- [ ] The unique ID is generated server-side (e.g., UUID), not derived from the input
- [ ] The result is stored in memory after analysis

### Get Transcript by ID
- [ ] Endpoint exists and retrieves a previously stored analysis by ID
- [ ] Returns the same shape as the analyze response

### HTTP Methods & Routing
- [ ] Appropriate HTTP method used for analysis: `POST` (creates a resource, more semantically correct) or `GET` (as literally stated in the assessment) — either is acceptable; assess consistency and documentation if asked
- [ ] Retrieval endpoint uses `GET`
- [ ] Routes follow RESTful conventions (e.g., `/transcripts`, `/transcripts/{id}`)
- [ ] Input transport is consistent and documented: query parameter for `GET`, request body for `POST`

---

## Input Validation

- [ ] Empty transcript returns `400 Bad Request` (not `500`, not `200`)
- [ ] Missing transcript field returns `400 Bad Request`
- [ ] Whitespace-only transcript is treated as empty and rejected
- [ ] Validation is done before calling the LLM adapter (no unnecessary API calls)

---

## HTTP Status Codes

| Scenario | Expected Code |
|---|---|
| Successful analysis (`POST`) | `200 OK` or `201 Created` |
| Successful analysis (`GET`) | `200 OK` |
| Transcript not found by ID | `404 Not Found` |
| Empty / invalid transcript | `400 Bad Request` |
| Unexpected server error | `500 Internal Server Error` |

- [ ] Status codes are explicit, not left to framework defaults
- [ ] Error responses have a consistent JSON body (e.g., `{"detail": "..."}`)

---

## Swagger / OpenAPI Documentation

- [ ] Swagger UI is accessible (e.g., `/docs` for FastAPI)
- [ ] All endpoints have descriptions or summaries
- [ ] Request and response schemas are documented (Pydantic models serve as schema if using FastAPI)
- [ ] Error responses are documented (at least `400` and `404`)
- [ ] Response field types are correct and specific (not just `object` or `Any`)
