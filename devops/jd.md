# DevSecOps / Cloud Engineer (GCP)

**Location:** Remote (LATAM)  
**Contract Type:** Full-time Contractor

### **The Opportunity**

AceUp is evolving toward an AI-first platform. That means shipping and operating a growing set of services on Google Cloud—Ruby on Rails, Python, and Node.js—backed by Cloud SQL and Cloud Storage, with AI workloads in the mix.

We are looking for a **DevSecOps / Cloud Engineer** to work closely with our Infrastructure Lead. You will help design and harden how we build, deploy, and run in the cloud: secure by default architecture, automated guards in the pipeline, and reproducible infrastructure—while keeping deploys frequent and production healthy. You will also care about **FinOps** and business-facing signals: whether our platform is efficient, sustainable in cost, and clearly tied to the value AceUp delivers. You will grow ownership of platform, security, and that broader measurement posture over time.

### **The Tech Stack**

- **Cloud:** Google Cloud Platform (GCP)
- **Compute:** Cloud Run (primary), Cloud Functions where it fits
- **Data:** Cloud SQL, Cloud Storage
- **Infrastructure as Code:** Terraform
- **CI/CD:** GitHub Actions with continuous integration to staging/production
- **Apps:** Ruby on Rails, Python, and Node.js services (same footprint across the platform)
- **Observability & FinOps:** OpenTelemetry-based instrumentation with Datadog / GCP Cloud Monitoring / Sentry as backends (including LLM/agent observability); GCP billing & cost insights (including model/token spend); business and product metrics that show platform value
- **Security & compliance:** GCP IAM, VPC / network controls, Secret Manager, Cloud Armor, container and dependency scanning, supply-chain security (SBOM, SLSA provenance, artifact signing with Sigstore/cosign, Binary Authorization, Artifact Registry), Vanta (SOC2)

### **What You Will Do**

- **Shape security architecture:** Help design how services, data, and identities connect on GCP—network boundaries, service-to-service auth, least-privilege IAM, secrets, and encryption so Rails, Python, and Node.js workloads stay isolated and auditable.
- **Bake security into delivery:** Extend GitHub Actions with DevSecOps practices (image/dependency scanning, policy checks, secret hygiene) and secure the supply chain—SBOM generation, SLSA provenance, artifact signing (Sigstore/cosign) enforced via Binary Authorization, actions pinned to commit SHA, and OIDC workload identity federation instead of long-lived keys—so every path from merge to Cloud Run is reviewed for risk without blocking the team.
- **Ship continuously:** Maintain and improve CI/CD so services move to Cloud Run safely and often—with clear rollbacks, environment promotion, and security gates that fail closed on real issues.
- **Run Cloud Run well:** Configure services, revisions, traffic splits, secrets, and identity so microservices stay reliable and hard to misuse.
- **Own the foundation; share service IaC:** Own shared and foundational GCP infrastructure in Terraform (networking, IAM baselines, security controls, shared data platforms, common platform building blocks). For service-level resources (Cloud Run apps, service DBs, buckets, etc.), **ownership is shared with developers**—you are the referent: you teach, review, support, and raise the bar so teams can own and evolve the IaC for what they build, consistently across Staging and Prod.
- **Protect data paths:** Support secure access to Cloud SQL and Cloud Storage (connectivity, backups, access policies) especially for product and AI pipelines that handle sensitive data.
- **Monitor more than uptime:** Track technical health via SLIs/SLOs and error budgets (latency, errors, saturation, security signals) and also **cost and efficiency (FinOps)**—rightsizing Cloud Run, Cloud SQL, and Storage, attributing model/token spend, surfacing spend anomalies, and helping the team spend where it creates leverage.
- **Make value visible:** Partner with product and engineering so we instrument and report **business-driven metrics** that show what the technology is adding for AceUp (e.g. adoption, reliability of customer-facing journeys, cost-to-serve, delivery speed)—not only “is the box green.”
- **Partner with engineering:** Enable developers to ship securely and own their service infrastructure: patterns, modules, reviews, Docker/images, health checks, secrets, and promotion paths—without becoming a ticket bottleneck.
- **Collaborate across teams:** Work closely with both AI and platform engineering teams to shape reliable, secure, and predictable infrastructure.
- **Triage production:** Be ready to triage critical production with the teams and aid in any possible way.

### **Who You Are**

- You think in systems: identity, network, and data exposure matter as much as “does it deploy.”
- You prefer defining infrastructure and security controls in code over clicking around in the console—and you enjoy teaching others to do the same.
- You are comfortable with containers (Docker) and deploying to a managed platform like Cloud Run.
- You care about making deploys repeatable, reversible, and checkable—not heroic—and about enabling developers to own what they run.
- You care why we run infrastructure: cost, efficiency, and outcomes for AceUp’s customers and business—not observability for its own sake.
- You communicate clearly about risk, cost, and trade-offs; you ask good questions when something is unclear.
- You enjoy growing into broader platform, security, and measurement ownership with guidance from a more senior infra lead.

### **Requirements**

- Hands-on experience with a major cloud provider (**GCP preferred**; **AWS** or **Azure** also welcome). Comfortable with managed compute, databases, object storage, and IAM—or ready to map those concepts onto GCP.
- Interest and some practice in **security architecture** / **DevSecOps**: least-privilege IAM, secrets management, network basics, and/or scanning in CI—enough to improve our baseline with guidance.
- Practical **Terraform** experience: you have written and applied modules or configs for real environments (including IAM or networking is a plus).
- Experience building or maintaining **CI/CD with GitHub Actions** (build, test, deploy); exposure to security and supply-chain steps in the pipeline is valued (e.g. scanning, SHA-pinned actions, OIDC/workload identity federation, SBOM or artifact signing).
- Comfort with **Docker** and deploying containerized apps.
- Scripting experience in **Bash**, plus comfort reading and operating in at least one of **Ruby**, **Python**, or **Node.js** (ideally more than one).
- Familiarity with how web apps and APIs are deployed (env vars, secrets, health checks, databases).
- Curiosity about **FinOps** and measuring technology’s impact—you’ve looked at cloud spend, efficiency, or product/business metrics before, or you’re eager to learn.
- Practice with **AI-assisted development** and **spec-driven development**: you use AI tools day to day against clear specs/acceptance criteria (not only ad-hoc prompting), and you’re comfortable iterating specs, reviews, and implementation with that workflow. You’re also interested in bringing AI into the pipeline itself—agentic code review, IaC generation and scanning, and automated checks—so the platform reflects AceUp’s AI-first posture.
- Conversational English.

### **Nice to Haves**

- Stronger background in cloud security architecture (VPC design, private service access, WAF / Cloud Armor, Zero Trust-style service auth).
- Hands-on **FinOps**: cloud billing reports, budgets/alerts, tagging/attribution, rightsizing, cost-to-serve analysis, or tracking AI model/token spend.
- Helping define or track **business / product metrics** alongside SLIs (adoption, journey success, delivery lead time, cost per outcome).
- Production deploys for **Rails**, **Python**, and/or **Node.js** services (CI/CD, workers/jobs, migrations)—experience with any of them counts; breadth across the stack is a plus.
- Continuously deploying to multiple environments (e.g. staging → production) with automated security gates.
- Container / dependency / IaC scanning tools (e.g. Trivy, Snyk, Checkov, or GCP native scanning).
- Software supply-chain security: SBOMs, SLSA provenance/attestation, artifact signing (Sigstore/cosign), and Binary Authorization for Cloud Run.
- Observability with OpenTelemetry, Datadog, Cloud Monitoring, or Sentry; defining SLIs/SLOs and error budgets.
- Exposure to SOC2 / compliance tooling (e.g. Vanta).
- Interest in AI/ML and agentic workloads on GCP (e.g. Vertex AI, agent frameworks, MCP servers, LLM gateways / model routing, vector stores, RAG-related data paths) and LLMOps (evals, token/latency observability)—curiosity beats prior expertise, especially around securing these flows (prompt injection, tool abuse), protecting sensitive data, and understanding their cost/value.

AceUp is proud to be an equal opportunity employer, seeking to create a welcoming and diverse environment.

All qualified applicants will receive consideration for employment without regard to race, color, religion, gender, gender identity or expression, sexual orientation, national origin, genetics, disability, age, or veteran status.

Please send us a resume and a short intro to careers@aceup.com
