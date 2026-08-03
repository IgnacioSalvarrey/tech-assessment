# Integration with Provided Interfaces

Evaluates strict compliance with the ports/adapters pattern defined in the provided files, and correct use of the OpenAI adapter and DTOs.

---

## Port Compliance

The provided port is:
```python
class LLm(ABC):
    @abstractmethod
    def run_completion(self, system_prompt: str, user_prompt: str, dto: type[pydantic.BaseModel]) -> pydantic.BaseModel:
        pass
```

- [ ] The service layer calls `run_completion()` with the correct signature: `(system_prompt, user_prompt, dto_class)`
- [ ] The `LLm` abstract class is **not modified**
- [ ] The `OpenAIAdapter` class is **not modified**
- [ ] The candidate does not bypass the port by calling `openai` directly from the service layer

---

## DTO Definition

The adapter uses OpenAI's structured output — the DTO class passed to `run_completion()` defines the response schema.

- [ ] A Pydantic `BaseModel` DTO is defined with the fields: `summary` (str) and `action_items` (list of strings)
- [ ] The DTO is passed as a **class** (not an instance) to `run_completion()`
- [ ] The DTO is defined in an appropriate layer (not inside a route handler or mixed with API response models)
- [ ] The returned Pydantic model instance is correctly accessed (e.g., `.summary`, `.action_items`) without unsafe casting

---

## Prompt Usage

The provided `app/prompts.py` contains the system and user prompts:

- [ ] The candidate uses `app/prompts.py` prompts (or extends them) rather than writing ad-hoc strings inline
- [ ] The transcript text is correctly interpolated into the user prompt template — not passed as a separate message or appended without using the placeholder

---

## Test as Specification

The provided `tests/adapters/test_openai.py` documents expected adapter behavior:

- [ ] The candidate did not modify the existing test
- [ ] The candidate's DTO matches the structure validated in the existing test (fields `summary` and `action_items`)
- [ ] Any new tests written by the candidate mock the `LLm` port, not the `OpenAIAdapter` directly
