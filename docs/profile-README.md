# Backend and ML engineer. I ship systems end to end, not notebooks.

Montréal · MSc Applied Computer Science, Concordia (2026) · previously R&D Engineer at Synopsys, on production server maintenance and internal engineering tools in Python, C++ and PHP.

**Open to full-time roles** in Backend, ML Engineering, MLOps and AI automation. Montréal, hybrid, or remote in Canada.

[**nanthansr.github.io**](https://nanthansr.github.io/) · [writing](https://nandytriesthings.hashnode.dev/) · [LinkedIn](https://www.linkedin.com/in/nanthan-sr/) · nanthansr@gmail.com

---

## Culprit - step-level attribution as a merge gate

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="img/culprit-dark.svg">
  <img alt="Three lanes. Record: the agent runs N times on the PR branch, a DecisionRecorder marks which steps actually made a stochastic decision, the rest are dropped because replaying them is provably a no-op, and LangGraph leaves a checkpoint before every step. Replay: rewind to the checkpoint before step k, re-roll that one decision and let everything downstream run fresh, repeat round-robin so every candidate step gets the same number of samples, and read off the shift in failure rate per step. Gate: compare the observed rate against the baseline committed in .culprit/baseline.json, and only if it regressed does attribution run and the process exit 1 with a markdown report for the pull request." src="img/culprit-light.svg">
</picture>

An agent run is a chain of decisions. When it fails at step 7, step 7 is usually innocent - step 2 picked the wrong tool, steps 3 to 6 ran fine on bad data, and step 7 was the first that couldn't paper over it. **The trace records where the failure surfaced, not where it started.**

So stop reading the trace and re-run it. Rewind to step k, let that one decision be made again, let everything downstream run fresh, repeat. If the failure rate moves, step k mattered. `git bisect` for a process that isn't deterministic.

- **The technique isn't mine.** Counterfactual step replay was published as [Causal Agent Replay](https://arxiv.org/abs/2606.08275). **Where it runs is mine** - CAR is a debugger you reach for after noticing a failure; this is a merge gate that trips at PR time, while the author still has the context.
- **LangGraph is load-bearing, not a résumé line.** You can only replay if you can rewind, and it checkpoints before every step. The project cannot exist without that one feature.
- **A cheap pre-pass** drops steps that made no stochastic decision, because replaying them is provably a no-op.
- **Round-robin budget spending**, so when the budget runs out every candidate has been sampled equally. Depth-first spending convicts whichever step happened to be measured well.
- **Three exit codes**, because CI reads exactly one number: 0 clean, 1 regression attributed, 2 the tool itself is broken.
- **The hard part is open and stated as such.** Resampling step k re-rolls everything after it, so `plan` inherits `pick_tool`'s entire effect and the two score identically. The strawman attributor takes the largest raw shift, scores ~58-71% against known ground truth, and never once reports that it is unsure. Being confidently wrong a third of the time is worse than the number suggests, and fixing it is the work in progress.

[Repo](https://github.com/nanthansr/culprit)

`Python` `LangGraph` `pytest` `GitHub Actions`

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

[Repo](https://github.com/nanthansr/mlops-fraud-pipeline) · [full technical walkthrough](https://nanthansr.github.io/case-fraud-pipeline.html) · live demo moving to Hugging Face Spaces

`Python` `XGBoost` `FastAPI` `MLflow` `Evidently` `Prometheus` `Grafana` `Docker` `GitHub Actions` `AWS`

---

## Also built

**[Pomofocus](https://github.com/nanthansr/pomofocus)** - a macOS menu bar Pomodoro timer that never shows a number, because a visible countdown is itself a context switch. Native Swift, zero dependencies. Timing is anchored to an end date rather than a decrementing counter, so closing the lid mid-session doesn't corrupt the remaining time.

**[Visual Français](https://github.com/nanthansr/visual-francais)** - paste in French text, click any word, get an AI-generated image association. Vanilla JS over a Python proxy that keeps the Anthropic key off the client. Four Playwright end-to-end tests, written in French.

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

- [What I actually learned building a two-tier AWS architecture from scratch](https://nandytriesthings.hashnode.dev/what-i-actually-learned-building-a-two-tier-aws-architecture-from-scratch)
- [The frontend gauntlet: four errors, one evening, zero app code changed](https://nandytriesthings.hashnode.dev/the-frontend-gauntlet-four-errors-one-evening-zero-app-code-changed)
- [Three bugs. One night. This is what DevOps actually looks like.](https://nandytriesthings.hashnode.dev/three-bugs-one-night-this-is-what-devops-actually-looks-like)
- [Before you touch AWS, you need to think like Linux](https://nandytriesthings.hashnode.dev/before-you-touch-aws-you-need-to-think-like-linux)
- [Why I abandoned "toy apps" for a two-tier architecture](https://nandytriesthings.hashnode.dev/why-i-abandoned-toy-apps-for-a-two-tier-architecture)

Seven posts, all from early 2026. Dormant since March; starting again now.
All at [nandytriesthings.hashnode.dev](https://nandytriesthings.hashnode.dev/).

---

Tamil (native) · English (advanced, IELTS) · French (B1, working toward B2)

[![Portfolio](https://img.shields.io/badge/nanthansr.github.io-07080f?style=for-the-badge&logo=github&logoColor=white)](https://nanthansr.github.io/) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/nanthan-sr/) [![Email](https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:nanthansr@gmail.com)
