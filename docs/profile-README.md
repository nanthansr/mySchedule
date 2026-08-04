# Backend and ML engineer. I ship systems end to end, not notebooks.

Montréal · MSc Applied Computer Science, Concordia (2026) · previously R&D Engineer at Synopsys, on production server maintenance and internal engineering tools in Python, C++ and PHP.

**Open to full-time roles** in Backend, ML Engineering, MLOps and AI automation. Montréal, hybrid, or remote in Canada.

[**nanthansr.github.io**](https://nanthansr.github.io/) · [writing](https://nandytriesthings.hashnode.dev/) · [LinkedIn](https://www.linkedin.com/in/nanthan-sr/) · nanthansr@gmail.com

---

## MLOps fraud detection pipeline

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="img/fraud-pipeline-dark.svg">
  <img alt="Three lanes. Train: a Kaggle dataset of 284,807 transactions goes through XGBoost with scale_pos_weight 577 into an MLflow registry under a champion alias. Serve: a transaction hits FastAPI for schema validation, then the model held in memory, returning a score in 2 to 5 milliseconds; the registry promotes a new model without a redeploy. Watch: Evidently runs a scheduled drift check into a Pushgateway, Prometheus and Grafana rules read it alongside per-prediction counters from FastAPI, and an alert fires by email." src="img/fraud-pipeline-light.svg">
</picture>

Models degrade quietly. Feature distributions shift, confidence drifts, and by the time anyone notices the model has been wrong for weeks. So the fraud model here is the vehicle; **the detection layer around it is the point.**

- **284,807 transactions, 492 of them fraud** - a 577:1 imbalance. Logistic regression collapsed on recall, so XGBoost with `scale_pos_weight=577`.
- **PR-AUC as the primary metric, not ROC-AUC.** A model that predicts "always legitimate" scores 0.97 ROC-AUC on this data. PR-AUC exposes that; ROC-AUC hides it.
- **2-5 ms per prediction** through FastAPI with typed request schemas.
- **Promotion without redeployment** via an MLflow `@champion` alias.
- **Alerts that are tested, not assumed.** `simulate_incident.py` replays a fraud spike and a distribution shift and proves the Grafana rules actually fire.
- Runs at **$0/month** on an Oracle Cloud Always Free ARM VM behind Nginx, after an earlier AWS ECS Fargate deploy using keyless OIDC.

[Repo](https://github.com/nanthansr/mlops-fraud-pipeline) · [full technical walkthrough](https://nanthansr.github.io/case-fraud-pipeline.html)

`Python` `XGBoost` `FastAPI` `MLflow` `Evidently` `Prometheus` `Grafana` `Docker` `GitHub Actions` `AWS`

---

## Also built

**[Multipaste](https://github.com/nanthansr/multipaste)** - a macOS clipboard buffer for rapid sequential copy-paste rather than long-term history. Native Swift, shipped as a built `.app` with a Sparkle update channel. Honest gap: no test suite yet.

**[Learn-buddy](https://github.com/nanthansr/learn-buddy)** - matchmaking for study partners, built with a cross-disciplinary grad team. FastAPI, Postgres, docker-compose, CI on every push. The part worth reading is `DECISIONS.md`: it records what we chose and what we rejected.

**[Visual Français](https://github.com/nanthansr/visual-francais)** - paste in French text, click any word, get an AI-generated image association. Vanilla JS over a Python proxy to the Anthropic API, with Playwright end-to-end tests.

**[Two-tier AWS architecture](https://github.com/nanthansr/aws-two-tier-project)** - FastAPI and React containerised onto EC2. A brownfield DevOps exercise, written up as a six-part series on the blog.

---

## Stack

| | |
|---|---|
| **Languages** | Python, C++, C, Java, JavaScript, SQL, Bash, Swift |
| **Backend** | FastAPI, REST, Server-Sent Events, PostgreSQL, SQLAlchemy, SQLite |
| **ML / MLOps** | XGBoost, scikit-learn, MLflow, Evidently, Prometheus, Grafana, drift detection, class-imbalance handling |
| **Cloud / DevOps** | AWS (ECS Fargate, ECR, S3, IAM OIDC), Oracle Cloud, Docker, GitHub Actions, Nginx, Cloudflare Workers |
| **AI-native** | Claude Code multi-agent workflows, Model Context Protocol (MCP), LLM integrations across Anthropic, Gemini, OpenRouter and Groq, n8n |

Currently learning Kubernetes and Terraform. Not claiming them as skills until they're solid.

---

## Writing

I write up the parts that went wrong, because those are the parts worth reading.

- What I actually learned building a two-tier AWS architecture from scratch
- Three bugs. One night. This is what DevOps actually looks like.
- Before you touch AWS, you need to think like Linux

All at [nandytriesthings.hashnode.dev](https://nandytriesthings.hashnode.dev/).

---

Tamil (native) · English (advanced, IELTS) · French (B1, working toward B2)

[![Portfolio](https://img.shields.io/badge/nanthansr.github.io-07080f?style=for-the-badge&logo=github&logoColor=white)](https://nanthansr.github.io/) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/nanthan-sr/) [![Email](https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:nanthansr@gmail.com)
