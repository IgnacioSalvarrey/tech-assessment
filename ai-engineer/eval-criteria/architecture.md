# Architecture & Code Structure

Evaluates adherence to hexagonal (clean) architecture, layer separation, avoidance of coupling, and modularity.

---

## Layer Identification

The project skeleton establishes:
- **Ports** (`app/ports/`): abstract interfaces
- **Adapters** (`app/adapters/`): concrete implementations of ports
- **Application/Domain**: business logic (service or use-case layer)

- [ ] The candidate added a distinct service/use-case layer (not just endpoint functions calling the adapter directly)
- [ ] An in-memory store (repository) is implemented as its own component, not inlined in the route handler
- [ ] DTOs/response models for the API are defined separately from the LLM response models

---

## Layer Coupling

- [ ] The service/use-case layer depends only on the `LLm` **port** (abstract class), not on `OpenAIAdapter` directly
- [ ] Route handlers do not instantiate `OpenAIAdapter` or call OpenAI directly
- [ ] The `OpenAIAdapter` is injected into the service (constructor injection or dependency injection via framework)
- [ ] The in-memory store is not a global variable accessed directly from route handlers

---

## Dependency Injection

- [ ] `OpenAIAdapter` is constructed once (at startup) and injected — not re-instantiated per request
- [ ] The adapter reaches the service via injection (constructor, `Depends()`, app-lifespan, or module-level singleton) — what matters is that it is not instantiated inside business logic, not which wiring mechanism is used

---

## Module Structure

- [ ] New code is added in logically named modules/packages (e.g., `app/services/`, `app/routers/`, `app/models/`)
- [ ] No business logic lives in `main.py` or the router file beyond wiring
- [ ] The `app/ports/` and `app/adapters/` directories are not modified (the provided interfaces are treated as fixed contracts)

---

## Modularity

- [ ] Adding a new LLM provider would require only creating a new adapter, with no changes to the service or routes
- [ ] Swapping in-memory storage for a real database would be isolated to the repository/store component
