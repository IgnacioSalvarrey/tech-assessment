# DevSecOps Homework — Evaluation Criteria

Companion rubric for [`../homework/assignment.md`](../homework/assignment.md), scored against the
[DevSecOps / Cloud Engineer (GCP) JD](../jd.md).

The assignment is **deliberately open**: most tasks say "the design is yours — we evaluate your
decisions." This rubric exists so that openness does not become subjectivity. For each open
decision we enumerate the realistic choices a candidate can make, then define what **Strong /
Acceptable / Weak / Red-flag** looks like for that choice. The point is not "did they pick the
option we like" — it's **"did they make a defensible choice, execute it fully, and reason about
the trade-off."** A candidate who picks a simpler option and nails every consideration should
outscore one who picks the fashionable option and half-implements it.

---

## How to use this rubric

**Scoring scale (per area):**

| Score | Meaning |
|------:|---------|
| **4 — Strong** | Senior signal. Defensible decision, fully executed, trade-off articulated, edge/failure modes considered. Would trust this in our pipeline. |
| **3 — Acceptable** | Solid mid-level. Reasonable decision, mostly complete, minor gaps, some reasoning. |
| **2 — Weak** | Works but shallow. Decision unexplained or partially implemented; misses obvious considerations. |
| **1 — Poor** | Doesn't work, copy-pasted, or contradicts stated goals. |
| **0 — Absent** | Not attempted. |

**Weighting** (reflects JD priorities — secrets, supply chain, and differential delivery are the job):

| # | Area | Weight |
|--:|------|-------:|
| 1 | Differential CI/CD (change detection + rebuild/redeploy graph) | 15% |
| 2 | Secrets & security handling | 20% |
| 3 | DevSecOps baseline (supply chain, scanning, identity) | 15% |
| 4 | Containerization | 9% |
| 5 | IaC (Terraform) | 9% |
| 6 | Integration testing on floci | 9% |
| 7 | Monorepo & DX | 3% |
| 8 | Operability & rollback | 5% |
| 9 | Communication (README / DESIGN.md) | 5% |
| 10 | Local environment isolation & reproducible tooling | 5% |
| 11 | Delivery — immutable artifacts & registry (GHCR) | 5% |

> Differential CI/CD (15%) + Delivery (5%) together weight the "differential delivery" JD axis at
> 20% — co-equal with Secrets (20%) — while scoring the *rebuild/redeploy graph* and the
> *artifact store* independently.

**Golden rule of an open-ended homework:** reward *reasoned* decisions over *maximal* ones. A
`DESIGN.md` that says "I chose X over Y because Z, and here's what breaks" is worth more than an
unexplained kitchen-sink implementation. Conversely, "I did everything" with no rationale and
broken glue is a **Weak**, not a Strong.

---

## The starter, as it actually is (evaluator's ground truth)

Verify claims against this. Candidates who *discover and document* these facts themselves are
showing exactly the "think in systems" signal the JD asks for.

- **Dependency graph** (from workspace `package.json` deps — this is the source of truth for
  differential deploy):
  - `packages/http-client` → used **only by `orders`**
  - `packages/logger`, `packages/secrets`, `packages/types` → used by **all three services**
  - `orders` → depends on inventory **and** notifications at runtime (calls them over HTTP)
  - `inventory`, `notifications` → no service-to-service deps
- **Ports:** orders `8080`, inventory `8081`, notifications `8082` (all read `process.env.PORT`).
  Cloud Run injects `PORT=8080` per container.
- **Secrets:** `inventory-api-token`, `notifications-api-token`. Project `floci-local`. The client
  is `@google-cloud/secret-manager` (**gRPC**), created with **no `apiEndpoint`**.
- **Boot behaviour:** every service loads secrets in `main()` and calls `process.exit(1)` on
  failure. Missing/empty secret ⇒ **container never becomes healthy (crash-loop)**, not a
  runtime 500.
- **Auth:** `inventory /reserve` and `notifications /notify` validate `x-api-token` via
  `safeEqual` (length-checked constant-time-ish compare). **`orders /orders` has no auth.**
- **Health:** `GET /health` present on all three.
- **Committed `dist/`** exists in the starter even though `.gitignore` ignores `dist/`.

### Known traps (bonus signal if caught, not required)

These are places where the naive path silently fails or misleads. A candidate who flags them in
`DESIGN.md` demonstrates senior judgment; award a **+1 cross-cutting bonus** (see end).

1. **Secret Manager gRPC + emulator wiring.** `new SecretManagerServiceClient()` with no
   `apiEndpoint` does **not** reliably honor `SECRETMANAGER_EMULATOR_HOST` (that auto-read
   convention exists for Firestore/Pub-Sub/Datastore/Storage clients, not the Secret Manager
   Node client). To hit floci the candidate must point the client at the emulator (endpoint
   override + insecure channel) or otherwise route it. If their stack boots, check *how* they
   solved this — silence + "it works" may mean they never actually read from floci.
2. **Service-to-service URL discovery.** `orders` needs the deployed Cloud Run URLs of inventory
   and notifications injected at deploy time. How they wire this (Terraform output → env var) is
   a real design decision the assignment doesn't spell out.
3. **Crash-loop as the "missing secret" failure mode.** The negative-path test (Task 6) should
   assert *the revision fails to go healthy*, not a graceful HTTP error. Watch for candidates who
   invent a fictional 500 path.
4. **Committed `dist/` vs `.gitignore`.** Cleaning this up is a small correctness/tidiness signal.
5. **GHCR pull vs local image cache.** floci-gcp has **no Artifact Registry**, and its Cloud Run runs the container via the host Docker daemon — it **pulls** the image reference, it does not use a locally-built image cache. The assignment now directs candidates to push to **GHCR** and reference images **by digest**. A candidate who only `docker build`s locally and assumes floci runs that cached image has a **broken deploy path**; check that images actually reach GHCR and that floci pulls them (public package, or host `~/.docker` creds mounted).

---

## Area 1 — Differential CI/CD  (weight 15%)

> Open decisions: *how* changes are detected, *how* the dependency graph is derived, and *what
> granularity* rebuild/redeploy operates at.

### Decision A — Change-detection mechanism

| Choice | How to judge it |
|--------|-----------------|
| **Git-diff of paths** (`git diff --name-only` between base and head) | Acceptable baseline. Check: correct base ref (PR base, not `HEAD~1`, which breaks on squash/rebase and multi-commit PRs); handles first-commit / force-push; handles pushes to `main` differently from PRs. |
| **Graph-derived affected set** (diff → changed packages → transitive dependents from `package.json`) | **Strong.** This is what "assume they will grow" was testing. The affected set must be *computed*, not enumerated. |
| **Purpose-built tool** (Nx, Turborepo, `pnpm --filter ...[since]`) | Strong *if justified*. Reward the reasoning about buying vs. building; a bare `nx affected` with no explanation of how it maps to deploy is only Acceptable. |
| **Hardcoded path → service map** (`if orders/** changed → deploy orders`) | **Red flag for this exercise.** Works for 3 services, rots immediately, and ignores the shared-package fan-out. Cap at Weak even if it functions. |

### Decision B — Does the shared-package fan-out actually work?

This is the concrete correctness test. Verify with the real graph:

- ✅ Change only in `services/orders/**` ⇒ **only `orders`** builds/deploys. Inventory &
  notifications untouched.
- ✅ Change in `packages/http-client/**` ⇒ **only `orders`** rebuilds (it's the sole consumer).
  A candidate who rebuilds all three here **doesn't understand their own graph** — strong
  negative signal, because it's the subtle case.
- ✅ Change in `packages/logger|secrets|types/**` ⇒ **all three** rebuild/redeploy.
- ✅ Change in root config (`package.json`, lockfile, `tsconfig` base, CI files) ⇒ sensible
  "rebuild everything" fallback, ideally *explicitly reasoned* (safety over cleverness).

A **Strong** answer gets the `http-client → only orders` distinction right and documents the root
config fallback. A **Weak** one either fans out too broadly (safe but not "differential") or too
narrowly (misses shared-package dependents — the one thing the assignment explicitly forbids).

### Decision C — Granularity & correctness guarantees

- Test scope: are tests run for changed packages **and their dependents**, not just changed dirs?
  (A `logger` change with no re-test of the three services is a gap.)
- Race/ordering: if `orders` and `inventory` both change, does inventory deploy before orders
  needs it? Award for any awareness; don't require perfect orchestration.
- Idempotency: re-running the pipeline on the same SHA should be a no-op / safe.

**Scoring:** 4 = graph-derived, fan-out correct including the `http-client` subtlety, dependents
re-tested, fallback reasoned. 3 = git-diff + mostly-correct graph, minor gaps. 2 = works for the
easy cases but botches shared-package fan-out or over-broadly rebuilds. 1 = hardcoded map or
doesn't actually gate anything.

> Note: **artifact storage & immutability** (GHCR, digest pinning) is scored separately in
> **Area 11 — Delivery**. Area 1 covers only *which* services build/push (the differential graph),
> not *where/how* the resulting images are stored.

---

## Area 2 — Secrets & security handling  (weight 20%)

> Open decisions (assignment §"Secrets"): when/how secrets are created & versioned, how Cloud Run
> obtains values, the IAM/identity model, naming/rotation/failure modes, and CI seeding without
> leakage.

### Decision A — How Cloud Run obtains secret values

| Choice | How to judge it |
|--------|-----------------|
| **Runtime fetch via the SDK** (as the starter does) | Acceptable and consistent with the code. Must then solve the floci gRPC endpoint wiring (Trap #1). Reward if they discuss cold-start cost and caching. |
| **Cloud Run native secret → env var / volume mount** (`--set-secrets`) | **Strong** on real GCP: keeps the app dumb, moves access to platform IAM. But note it **changes the app's contract** (no SDK call) — check they reconciled that with the starter code, and how faithfully floci emulates `--set-secrets`. |
| **Baked into image / build arg / committed `.env`** | **Auto-fail for this area** (assignment forbids it explicitly). Grep the images and repo history. |

Either legitimate choice is fine; what matters is that it's **deliberate, wired end-to-end, and
the trade-off is named**. "I fetch at runtime because floci's `--set-secrets` fidelity is
uncertain, and I cache for the process lifetime" is a Strong answer.

### Decision B — IAM / identity model (real GCP vs floci)

floci is zero-auth locally, so this is evaluated on the **written real-GCP model**:

- Per-service runtime service account (not the default compute SA)?
- `secretAccessor` granted **per-secret**, least privilege — not project-wide?
- Deploy identity separated from runtime identity?
- Do they acknowledge floci won't enforce any of this and say what they'd add on real GCP?

**Strong** = per-service SA + per-secret binding + explicit floci-vs-real gap. **Weak** = "use
IAM" with no specifics, or one god service account.

### Decision C — Rotation, versioning & failure modes

- Version pinning: `latest` vs pinned version — and do they understand that with the starter's
  runtime fetch, rotation needs a **new revision / restart** to pick up (unless they re-fetch)?
- Missing secret: do they correctly describe the **crash-loop** behaviour (Trap #3), not a
  fictional graceful path?
- Wrong version / empty value: `MissingSecretError` path exercised?
- Naming convention that scales across services & environments (e.g. env-scoped names or separate
  projects) — and is it *justified*?

### Decision D — CI seeding without leakage

- Secrets seeded into floci at CI time come from **GitHub Environments/Actions secrets**, never
  committed.
- No `echo $SECRET`, no secret in logs; `--data-file=-`/stdin patterns; masking respected.
- Test tokens are ephemeral/dummy, not real credentials.

**Scoring:** 4 = deliberate access pattern wired end-to-end, per-service+per-secret IAM story,
honest failure-mode + rotation reasoning, clean CI seeding. 3 = works, one dimension thin (usually
rotation or per-secret IAM). 2 = secrets reach the app but IAM/rotation/failure hand-waved. 1 =
leakage, god SA, or `latest`-only with no reasoning. 0/auto-fail = secret in image or repo.

---

## Area 3 — DevSecOps baseline (supply chain & identity)  (weight 15%)

> Assignment §7 says "pick what you can justify; don't fake all of them." So **breadth is not the
> metric — justified, working depth is.** But some items are cheap and JD-explicit; treat them as
> expected, and treat the heavy supply-chain items as depth signals.

Score against this two-tier checklist. **Expected** items missing ⇒ cap the area at Weak.

**Expected (cheap, JD-explicit — should be present):**

- [ ] GitHub Actions **pinned to commit SHA** (not `@v4`). Easy, high-signal, JD-named.
- [ ] Real-GCP deploy identity via **OIDC / Workload Identity Federation**, no long-lived JSON
      keys — with the **specific roles** named (`run.developer`, `artifactregistry.writer`,
      `secretmanager.secretAccessor` scoped), not `owner`.
- [ ] **Dependency scanning** gating PRs (`npm audit` / Trivy fs / Snyk).
- [ ] **Container image scanning** before deploy (Trivy/Grype), with a stated fail threshold
      (e.g. fixable HIGH/CRITICAL).
- [ ] Cloud Run **ingress + service-to-service auth** described (real GCP: restricted ingress +
      IAM invoker + ID tokens; floci: open — gap acknowledged). Ties to `orders` having no auth.

**Depth signals (reward, don't require — mark which they did AND justified):**

- [ ] SBOM generation (syft/`docker sbom`) attached to images.
- [ ] Artifact signing with **cosign**, plus a **verify** step in the deploy path.
- [ ] **Binary Authorization** named as the real-GCP enforcement point (and that floci can't
      enforce it).
- [ ] **SLSA provenance** attestation from the build.
- [ ] Policy-as-code (Checkov/tfsec/OPA) over the Terraform.

**How to score the "did they justify it" requirement (the example you gave):** For each item the
candidate claims, verify it is **actually wired and enforcing**, not decorative:

- Scanning that runs but never fails the job = theatre → doesn't count as done.
- cosign that signs but nothing verifies = incomplete → half credit.
- A `DESIGN.md` line "I deferred SLSA provenance because X, here's how I'd add it" on an unclaimed
  item = **positive signal**, not a gap. Honest deferral > faked breadth.

**Scoring:** 4 = all Expected present and enforcing + ≥2 depth signals genuinely wired + explicit
deferral reasoning for the rest. 3 = all Expected present, depth thin. 2 = some Expected missing
or present-but-not-enforcing. 1 = security theatre (steps that never fail) or long-lived keys.

---

## Area 4 — Containerization  (weight 9%)

> Open decision: base image, build strategy, and hardening depth. The assignment says "small,
> reproducible, suitable for Cloud Run; no secrets in images." Your example maps here: if a
> candidate claims Docker security best practices, the criteria must verify **all** of them.

### Decision A — Image size / reproducibility strategy

| Choice | Judge it by |
|--------|-------------|
| **Multi-stage build** (build deps → slim runtime) | Expected baseline for a monorepo with workspace deps. Check they only ship the built service + its runtime deps, not the whole monorepo/`devDependencies`. |
| **Distroless / alpine / slim runtime** | Strong. Distroless or slim + reasoning about the trade-off (debuggability vs surface). |
| **Base pinned by digest** (`@sha256:...`) not floating tag | Strong; reproducibility signal. |
| **Single fat build, `node_modules` copied wholesale** | Weak — large, non-reproducible. |

Monorepo-specific: does the Dockerfile correctly resolve **workspace-linked packages**
(`@aceup/*`)? This is the real containerization challenge here — a naive `COPY . .` + `npm ci`
per service either fails or ships the entire repo. Reward correct handling (build from root
context / prune to the service, or pre-build + copy `dist`).

### Decision B — Runtime hardening checklist (the "all considerations" test)

If the candidate claims security best practices, verify each — partial claims lose credit:

- [ ] Runs as **non-root** user (`USER` set, not root).
- [ ] **No secrets** in `ENV`, `ARG`, or layers (grep history; check build args).
- [ ] Minimal/distroless base, **pinned by digest**.
- [ ] `npm ci` from committed lockfile (reproducible), not `npm install`.
- [ ] `NODE_ENV=production`, dev deps pruned.
- [ ] Listens on `$PORT` (Cloud Run contract) — not a hardcoded port.
- [ ] Read-only root filesystem / dropped capabilities where expressed (Cloud Run or compose).
- [ ] `.dockerignore` excludes `node_modules`, `.git`, `.env`, `dist` as appropriate.
- [ ] Image scan clean (cross-check Area 3).

**Scoring:** 4 = multi-stage, slim+digest-pinned, non-root, lockfile, workspace deps resolved
correctly, every hardening box that they claim is real. 3 = multi-stage + small + no secrets,
misses 1–2 hardening items. 2 = works but large/root/`npm install`. 1 = secrets in image or
doesn't build.

---

## Area 5 — Infrastructure as Code (Terraform)  (weight 9%)

> Open decisions: module structure, how environments are expressed, how endpoints target floci,
> and how the real-GCP swap is staged.

### Decision A — Environment modeling (the "not copy-pasted" test)

| Choice | Judge it by |
|--------|-------------|
| **Reusable module + per-env composition** (workspaces, `tfvars`, or `envs/{staging,prod}`) | **Strong** — this is the explicit rubric line. staging and prod differ by variables, not duplicated resource blocks. |
| **Copy-pasted `staging.tf` / `prod.tf`** | **Weak/Red flag** — the assignment calls this out directly. |
| **Single env only** | Incomplete — assignment requires two. |

### Decision B — floci targeting & real-GCP swap

- Provider endpoints overridden toward floci where practical (or documented why gcloud/CLI is
  used instead of the TF google provider for Cloud Run on the emulator — a legitimate call, since
  provider-vs-emulator fidelity is imperfect).
- **State backend & auth are swappable:** local/zero-auth for floci, GCS backend + OIDC/WIF for
  real GCP — documented, ideally parameterized.
- Secret **values** never in `.tf` or state committed to git (check for `terraform.tfstate`,
  inline secret strings, `default = "..."` on sensitive vars).
- Resources are minimal-but-credible (Cloud Run + secret wiring + IAM) — not an over-built VPC the
  non-goals told them to skip.

### Decision C — Readability & correctness

- `terraform validate` / `fmt` clean; variables typed and described; outputs used to wire
  service-to-service URLs (ties to Trap #2).
- No provider version drift / unpinned providers.

**Scoring:** 4 = DRY module, env-by-variable, swappable backend+auth, secrets clean, outputs wire
the graph. 3 = reasonable modules, minor duplication or thin real-GCP story. 2 = works but
copy-pasted envs or hardcoded values. 1 = secrets/state in git, or doesn't apply.

---

## Area 6 — Integration testing on floci  (weight 9%)

> Open decision: how hermetic, what the "cross-service happy path" and "negative path" actually
> assert.

Required coverage (assignment §6):

- [ ] **Health checks** for each deployed service (hits the deployed floci URL, not localhost).
- [ ] **Cross-service happy path**: create an order that exercises orders → inventory (→
      notifications), with the API tokens correctly available. Assert the order is *accepted* and
      stock decremented / notification recorded — not just a 200.
- [ ] **Negative path**: evidence services **fail safely when a required secret is missing**.
      Correct assertion = the revision **fails to become healthy / crash-loops** (Trap #3). A
      candidate asserting a graceful runtime 500 misread the code — note it.
- [ ] Pipeline **fails** when integration tests fail (verify the job actually gates, isn't
      `continue-on-error`).
- [ ] **Hermetic**: CI starts floci → seeds secrets → deploys → tests, reproducibly, no manual
      steps, no reliance on prior state.

Depth signals: auth negative test (call `/reserve` with wrong `x-api-token` ⇒ 401), ret/teardown
between runs, test isolation, waiting for revision-ready instead of `sleep 30`.

**Scoring:** 4 = all required + correct crash-loop negative path + genuinely hermetic + gates the
pipeline. 3 = health + happy path + a negative path, minor hermeticity gaps. 2 = health checks
only, or tests exist but don't gate. 1 = manual, or hits localhost not the deployed env.

---

## Area 7 — Monorepo & DX  (weight 5%)

> Open decision: keep npm workspaces or justify a change (pnpm/turbo/nx).

- Changing tooling is fine **if justified** (pnpm for speed/strictness, turbo/nx for the graph).
  An unjustified rewrite that adds friction is a negative; keeping npm workspaces and using them
  well is perfectly Strong.
- The "obvious how to" checklist actually works:
  - [ ] install once (`npm install` at root)
  - [ ] test one service vs all (`-w` vs `--workspaces`)
  - [ ] build one vs all
- Shared packages build/link correctly (build order respected; `@aceup/*` resolve).
- Tidiness: did they remove committed `dist/` (Trap #4)? Lockfile committed and used.

**Scoring:** 4 = clean, documented, one-command flows, tooling choice justified. 3 = works, lightly
documented. 2 = works but fiddly/undocumented. 1 = broken install/build.

---

## Area 8 — Operability & rollback  (weight 5%)

Documented and, where floci allows, demonstrated:

- [ ] How to see which Cloud Run **revision is live** (against floci).
- [ ] How to **roll back one service** (traffic to previous revision) — per-service, not
      all-or-nothing.
- [ ] staging → prod **promotion** mechanism, and why (manual approval / promote-after-staging /
      explicit workflow — assignment says pick one and justify).
- [ ] **Secret rotation** runbook consistent with their access pattern (Area 2C).
- [ ] **Known limitations** stated honestly: of the differential approach (e.g. monorepo-wide
      config changes, cross-service migrations) **and** of emulator-vs-real-GCP (IAM/Binary-Auth
      not enforced, `--set-secrets` fidelity, networking).

Honest limitation-listing is a strong senior signal; reward it heavily in this small area.

**Scoring:** 4 = all five, promotion justified, limitations candid. 3 = most, thin on rotation or
limitations. 2 = partial / generic. 1 = absent or hand-waved.

---

## Area 9 — Communication (README / DESIGN.md)  (weight 5%)

- **README:** architecture diagram (simple ok), how differential deploy works, exact local
  commands (start floci → export env → seed secrets → deploy), how CI uses floci. A second
  engineer can follow it cold.
- **DESIGN.md** covers all six required topics: change-detection strategy, promotion model,
  secrets design, floci-vs-real-GCP, security trade-offs, next steps.
- Writing quality: decisions **and their trade-offs and limits** — the JD explicitly values "you
  communicate clearly about risk, cost, and trade-offs." Reward "I chose X over Y because Z" over
  feature narration.

**Scoring:** 4 = reproducible + reasoned + honest about limits. 3 = complete, light on trade-offs.
2 = present but shallow/hard to follow. 1 = missing pieces.

---

## Area 10 — Local environment isolation & reproducible tooling  (weight 5%)

> Open decision (assignment §9): *how* the test/build/deploy loop is made reproducible on a clean
> machine without depending on host-installed software. The bar: a reviewer with only Docker (and a
> container runtime) can clone and run the pipeline end-to-end — no host Node/npm/Terraform/floci/
> gcloud install, tool versions **pinned inside containers**, and local and CI sharing the **same
> entrypoints**.

### Decision A — Isolation mechanism

| Choice | How to judge it |
|--------|-----------------|
| **`docker compose` test/tooling stack** (services + floci + a test runner, wired together) | **Strong** for the integration loop. Check floci, seeded secrets, and the test runner all run as containers with pinned versions; one command brings the loop up and tears it down. |
| **A pinned "tools" / builder image** (Node + Terraform + floci CLI + gcloud baked at fixed versions, invoked via `make`/script) | **Strong** — clean single source of truth for tool versions; check the image is digest/version-pinned and that CI uses the *same* image, not a parallel `setup-node`/`setup-terraform` path. |
| **Dev Container** (`.devcontainer`) | Acceptable–Strong for interactive DX; check it also covers the non-interactive CI/test path, not just editor ergonomics. |
| **Documented "install these versions on your host" (nvm/asdf/tool-versions)** | **Weak for this exercise** — pins versions but still depends on host-installed software; misses the stated Docker-isolation intent. Cap at Weak even if reproducible. |
| **No isolation — bare `npm`/`terraform` assumed present** | **Red flag** — the thing §9 explicitly rules out. |

### Decision B — Reproducibility & local/CI parity (the core test)

- [ ] **Only Docker (+ runtime)** required on the host; any thin task runner (`make`, shell,
      `docker compose`) is documented. No hidden host prerequisites (a specific Node, global CLIs).
- [ ] Tool versions (**Node, package manager, Terraform, floci, gcloud/CLIs**) are pinned **inside
      containers** — by digest or explicit version — not floating (`latest`) and not host-provided.
- [ ] **Same entrypoints local and CI:** CI invokes the same containerized targets a developer runs
      locally (no hand-maintained CI-only script that can drift). This is the highest-signal check.
- [ ] Unit tests, integration tests, and the floci-backed deploy are reproducible: same commands →
      same results on a clean machine.
- [ ] Trade-offs documented (compose vs. tools-image vs. dev-container; build-time/image-size cost)
      and any **native escape hatch** for developers who prefer running on the host.

Cross-checks: ties to **Area 6** (hermetic integration loop — start floci → seed → deploy → test
should be the containerized entrypoint) and **Area 4** (the build image should be the reproducible
one, not a second toolchain). Reward candidates who make "clone + `docker`-only + one command" real
and demonstrate it (green CI run using the same target).

**Scoring:** 4 = Docker-only host, all tools pinned in containers, local and CI share one
entrypoint, demonstrably reproducible, trade-offs reasoned. 3 = containerized loop works but one
gap (some host dependency, or CI path partially diverges). 2 = partial isolation — e.g. tests
containerized but deploy/build still assume host tooling, or versions unpinned. 1 = documented host
installs only / no real isolation. 0 = not attempted.

---

## Area 11 — Delivery: immutable artifacts & registry  (weight 5%)

> Open decision (assignment §3 "deliver"): *where* built images are stored and *how* they are
> addressed. The hard constraints: images must be **immutable** (not `:latest`-only) and
> **pullable by floci Cloud Run**, which pulls from a registry via the host Docker daemon — it
> does **not** run a locally-built image cache (see Trap #5). The assignment directs candidates to
> **GHCR**; floci has no Artifact Registry, so the real-GCP equivalent is documented, not run.

### Decision A — Artifact store

| Choice | How to judge it |
|--------|-----------------|
| **Push to GHCR, reference by digest** | **Expected / Strong.** `ghcr.io/<owner>/<service>` tagged by commit SHA and/or content digest; Cloud Run / Terraform pins the image **by digest**, so deploys are reproducible and rollback is a digest change (ties to Area 8). |
| **Local registry (`registry:2` / Zot) as an offline alternative** | **Acceptable–Strong *if justified*** (hermeticity / no external dependency) and floci still pulls from it. Not the assigned path, but a defensible, well-reasoned swap earns full marks. |
| **Mutable `:latest` only, or image referenced by tag not digest** | **Weak** — violates the immutability requirement; rollback and reproducibility break. |
| **Build locally, never push to a registry floci can pull** | **Red flag** — the deploy path is broken on floci (Trap #5); the emulator cannot run a cache-only image. Cap at Poor even if the build "succeeds." |

### Decision B — Immutability, pull-through & real-GCP mapping

- [ ] Images tagged **immutably** (commit SHA and/or content digest), **not** `:latest`-only.
- [ ] Cloud Run / Terraform references images **by digest** — reproducible deploys; rollback =
      re-point to a previous digest (ties to **Area 8**).
- [ ] floci actually **pulls** the image (public GHCR package, or host `~/.docker` creds mounted) —
      verify the deploy is not silently relying on a locally-cached build.
- [ ] Only **affected** services are built/pushed (the differential graph — cross-check **Area 1**);
      no unnecessary image churn.
- [ ] Real-GCP **Artifact Registry** mapping documented: same push-by-digest shape, swap the
      registry host + `artifactregistry.writer` via WIF (ties to **Area 3**).

**Scoring:** 4 = images in GHCR (or a justified registry), immutable and **digest-pinned end to
end**, floci demonstrably pulls them, only affected services pushed, AR mapping documented. 3 =
images reach a registry floci pulls but referenced by tag not digest, or AR mapping thin. 2 =
images stored but mutable `:latest` only / immutability not wired into the deploy. 1 = build-only
with no pullable registry (broken deploy path) or `:latest` churn. 0 = not attempted.

### Bonus signals (+, applied to overall impression, cap +1 band on the closest area)

- Independently **caught and documented a trap** (secret-manager gRPC wiring, service URL
  discovery, crash-loop failure mode, committed `dist/`).
- **FinOps / cost awareness** unprompted (Cloud Run min-instances=0, image size → cold start,
  right-sizing) — directly JD-relevant, not asked for here.
- **AI-in-the-pipeline** thinking (agentic review, IaC scanning) — JD-relevant.
- Fail-**closed** posture: security gates that block on real issues, with a documented
  break-glass.
- Treats service IaC as **developer-owned with the platform engineer as referent** (JD's shared-
  ownership model) rather than a central gatekeeper.

### Red flags (drag score down regardless of feature count)

- Any secret value in git, image, build arg, or logs → **auto-fail Area 2**, serious overall.
- Long-lived service-account JSON keys presented as the real-GCP model.
- Hardcoded path→service map sold as "differential."
- Rebuilding all services on an `http-client` change (misunderstands own graph).
- Security steps that run but never fail (theatre).
- Copy-pasted per-env Terraform.
- Green pipeline that doesn't actually deploy to / test against floci (mocked away).
- `DESIGN.md` that lists tools but explains no decisions.

---

## Seniority calibration

The JD is a mid-level DevSecOps role reporting to an Infra Lead ("improve our baseline **with
guidance**"), so calibrate accordingly — do not require staff-level output.

- **Junior / not yet:** differential deploy is a hardcoded map; secrets reach the app but IAM and
  rotation are hand-waved; security is `npm audit` only; no trade-off reasoning.
- **Target (hire):** graph-derived differential deploy with the shared-package fan-out correct;
  deliberate secrets access pattern wired end-to-end with a real-GCP IAM story; Expected
  DevSecOps items present and enforcing; DRY Terraform envs; hermetic integration tests that gate;
  `DESIGN.md` that reasons about trade-offs and limits.
- **Strong (senior signal):** the above **plus** ≥2 supply-chain depth items genuinely wired,
  independently caught traps, cost/ownership awareness, and candid limitation analysis of both the
  differential approach and the emulator.

---

## Scorecard template

| Area | Weight | Score (0–4) | Weighted | Notes |
|------|-------:|:-----------:|---------:|-------|
| 1. Differential CI/CD | 15% | | | |
| 2. Secrets & security | 20% | | | |
| 3. DevSecOps baseline | 15% | | | |
| 4. Containerization | 9% | | | |
| 5. IaC (Terraform) | 9% | | | |
| 6. Integration testing | 9% | | | |
| 7. Monorepo & DX | 3% | | | |
| 8. Operability & rollback | 5% | | | |
| 9. Communication | 5% | | | |
| 10. Local isolation & reproducible tooling | 5% | | | |
| 11. Delivery — immutable artifacts & registry | 5% | | | |
| **Cross-cutting bonus** | — | +____ | | traps caught / FinOps / AI-in-pipeline |
| **Red flags** | — | | | auto-fail / drag noted |
| **Total** | 100% | | **/4** | |

**Recommendation:** ☐ Strong hire ☐ Hire ☐ Lean hire (discuss) ☐ No hire
**One-line rationale:**
