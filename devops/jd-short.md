# DevSecOps / Cloud Engineer (GCP)

**Location:** Remote (LATAM)
**Contract Type:** Full-time Contractor

### The Opportunity

AceUp is building an AI-first platform on Google Cloud—Ruby on Rails, Python, and Node.js services backed by Cloud SQL and Cloud Storage. We're looking for a **DevSecOps / Cloud Engineer** to work with our Infrastructure Lead on how we build, deploy, and run in the cloud: secure-by-default architecture, automated guards in the pipeline, and reproducible infrastructure—while keeping deploys frequent and production healthy. You'll grow ownership of platform and security over time.

### The Tech Stack

- **Cloud:** GCP — Cloud Run (primary), Cloud Functions where it fits
- **Data:** Cloud SQL, Cloud Storage
- **IaC:** Terraform
- **CI/CD:** GitHub Actions (continuous deployment to staging/production)
- **Apps:** Ruby on Rails, Python, and Node.js services
- **Security:** GCP IAM, VPC/network controls, Secret Manager, Cloud Armor, container/dependency scanning, supply-chain security (SBOM, artifact signing, Binary Authorization)
- **Observability:** OpenTelemetry with Datadog / GCP Cloud Monitoring / Sentry

### What You Will Do

- **Shape security architecture:** Design how services, data, and identities connect on GCP—network boundaries, service-to-service auth, least-privilege IAM, secrets, and encryption.
- **Bake security into delivery:** Extend GitHub Actions with image/dependency scanning, policy checks, and supply-chain security (SBOM, artifact signing, SHA-pinned actions, OIDC workload identity federation)—so every path from merge to Cloud Run is reviewed for risk without blocking the team.
- **Ship continuously:** Maintain and improve CI/CD so services move to Cloud Run safely and often—with clear rollbacks, environment promotion, and gates that fail closed on real issues.
- **Run Cloud Run well:** Configure services, revisions, traffic splits, secrets, and identity so services stay reliable and hard to misuse.
- **Own the foundation; share service IaC:** Own shared and foundational GCP infrastructure in Terraform (networking, IAM baselines, security controls). For service-level resources, ownership is shared with developers—you teach, review, and support so teams can own their IaC.
- **Protect data paths:** Support secure access to Cloud SQL and Cloud Storage (connectivity, backups, access policies), including AI pipelines handling sensitive data.
- **Monitor health:** Track SLIs/SLOs and error budgets (latency, errors, saturation, security signals), and keep an eye on cost and efficiency.
- **Partner with engineering:** Enable developers to ship securely and own their service infrastructure—patterns, modules, reviews, health checks, secrets, and promotion paths.
- **Collaborate across teams:** Work closely with both AI and platform engineering to shape reliable, secure, and predictable infrastructure.
- **Triage production:** Be ready to join critical production incidents with the teams and help in any way you can.

### Who You Are

- You think in systems: identity, network, and data exposure matter as much as "does it deploy."
- You prefer defining infrastructure and security in code, and enjoy teaching others to do the same.
- You're comfortable with containers (Docker) and a managed platform like Cloud Run.
- You make deploys repeatable, reversible, and checkable—not heroic.
- You communicate clearly about risk and trade-offs, and ask good questions when something is unclear.

### Requirements

- Hands-on experience with a major cloud provider (**GCP preferred**; AWS or Azure welcome). Comfortable with managed compute, databases, object storage, and IAM.
- Interest and some practice in **security architecture / DevSecOps**: least-privilege IAM, secrets management, network basics, and/or scanning in CI.
- Practical **Terraform** experience: you've written and applied modules or configs for real environments.
- Experience building or maintaining **CI/CD with GitHub Actions** (build, test, deploy); exposure to security/supply-chain steps is valued.
- Comfort with **Docker** and deploying containerized apps.
- Scripting in **Bash**, plus comfort reading and operating in at least one of **Ruby**, **Python**, or **Node.js**.
- Familiarity with how web apps and APIs are deployed (env vars, secrets, health checks, databases).
- Practice with **AI-assisted, spec-driven development**: you use AI tools day to day against clear specs, and you're interested in bringing AI into the pipeline itself (agentic code review, IaC generation and scanning).
- Conversational English.

### Nice to Haves

- Stronger cloud security background (VPC design, private service access, WAF/Cloud Armor, Zero Trust-style service auth).
- Container/dependency/IaC scanning tools (Trivy, Snyk, Checkov, or GCP native).
- Software supply-chain security (SBOMs, SLSA provenance, artifact signing, Binary Authorization).
- Observability with OpenTelemetry, Datadog, Cloud Monitoring, or Sentry; SLIs/SLOs.
- Exposure to SOC2 / compliance tooling (e.g. Vanta).
- FinOps: cloud billing, budgets/alerts, rightsizing, or tracking AI model/token spend.
- Interest in AI/ML workloads on GCP (Vertex AI, agent frameworks, LLM gateways, RAG data paths) and securing them (prompt injection, tool abuse, sensitive data).

AceUp is proud to be an equal opportunity employer, seeking to create a welcoming and diverse environment. All qualified applicants will receive consideration for employment without regard to race, color, religion, gender, gender identity or expression, sexual orientation, national origin, genetics, disability, age, or veteran status.

Please send us a resume and a short intro to careers@aceup.com
