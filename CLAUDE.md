# CLAUDE.md — mySchedule / Career Portfolio

This file is loaded at the start of every Claude Code session. It encodes all project conventions so sessions start productive immediately.

---

## What This Repo Is

A **pure static HTML/CSS/JS** personal site with no framework, no build step, no dependencies.
Serves two purposes:
1. **Daily-use personal dashboard** (schedule, workout, project tracker)
2. **Public hiring surface** for an active Montreal MLOps job search (Spring 2026)

Files: `index.html`, `mobile.html`, `projects.html`, `mlops-career.html`, `workout-plan.html`, `portfolio.html`, `case-fraud-pipeline.html`

---

## Hard Constraints

- **No framework, no bundler.** Pure HTML/CSS/JS only. Never suggest React, Vue, npm, webpack, etc.
- **No external JS libraries** (no jQuery, no lodash). Vanilla JS only.
- **No backend.** Everything is client-side. Persistence = localStorage + optional GitHub Gist sync.
- **No new files** unless clearly required. Prefer editing existing files.
- **No TypeScript.** Plain `.js` inside `<script>` tags.

---

## Design Tokens (CSS custom properties)

Each page has its own design system — do not mix tokens across files.

### `portfolio.html` (hiring surface — dark, copper accent)
```
--bg: #07080f; --surface: #141728; --accent: #c9773a;
--font-disp: 'Playfair Display'; --font-mono: 'DM Mono'; --font-body: 'DM Sans'
```

### `mlops-career.html` (career intel — dark, cyan accent)
```
--bg: #0a0c10; --surface: #111418; --accent: #00d4ff; --accent2: #7c3aed; --accent3: #22c55e
--font: 'Space Grotesk', 'IBM Plex Mono'
```

### `projects.html` (vault — dark, yellow-green accent)
```
--bg: #0d0d0d; --accent: #e8ff3c; --accent2: #3cffb0
--font: 'Bebas Neue', 'DM Mono', 'Fraunces'
```

### `index.html` / `mobile.html` (schedule — dark, blue accent)
Check `--accent` and font imports at top of each file.

---

## localStorage Keys

| Key | File | Purpose |
|-----|------|---------|
| `nanthan_vault_v2` | projects.html | All project cards |
| `nanthan_vault_modified_at` | projects.html | Last modified timestamp |
| `nanthan_vault_sync_v1` | projects.html | Gist sync config (gistId + token) |
| `nanthan_mlops_progress_v1` | mlops-career.html | Section 3 checklist checkmarks |
| `nanthan_jobs_v1` | mlops-career.html | Job application tracker entries |
| `nanthan_theme_v1` | portfolio.html | light/dark theme preference |

**GitHub tokens** in `nanthan_vault_sync_v1` are stored in localStorage — this is intentional (local-only tool). Never log or expose them.

---

## GitHub Gist Sync Pattern

`projects.html` uses a proven pattern for cloud backup. The pattern is:
1. Load from `localStorage` on init
2. On "Sync Now": fetch remote Gist, compare `updatedAt` timestamps, push local if newer / pull remote if newer
3. Gist file name: `projects-vault.json`, envelope: `{ schema, updatedAt, projects }`

When porting this pattern to other files (e.g., job tracker), use a new Gist file name and storage key.

---

## Navigation Bar Pattern

All internal pages share a pill-style quick-nav in the header:
```html
<nav class="quick-nav" aria-label="Quick pages">
  <a class="quick-link" href="mobile.html">Schedule</a>
  <a class="quick-link" href="projects.html">Projects</a>
  <a class="quick-link active" href="mlops-career.html">Career</a>
  <a class="quick-link" href="workout-plan.html">Workout</a>
  <a class="quick-link" href="portfolio.html">Portfolio</a>
</nav>
```
The `active` class marks the current page. `portfolio.html` uses a different nav (fixed top nav with anchor links).

---

## Section Numbering in `mlops-career.html`

- Section 01: JD Skills Analysis
- Section 02: AIOps Tools
- Section 03: Fraud Pipeline Upgrade Checklist (interactive, localStorage-backed)
- Section 04: Gap Analysis
- Section 05: Interview Signals
- Section 06: Montreal Target Companies
- Section 07: 6-Week Roadmap
- Section 08: Job Application Tracker (kanban, localStorage-backed)

---

## Security Notes

- The `cardHTML()` function in `projects.html` renders user-editable fields (`p.title`, `p.tagline`, `p.tags`) into innerHTML. Use `escapeHTML()` before injecting.
- GitHub tokens are stored in localStorage under `nanthan_vault_sync_v1`. This is intentional — it's a local tool. Never expose in URLs, log statements, or page content.

---

## Career Context

**Goal:** MLOps / Cloud Engineer role in Montreal by Spring 2026 graduation.
**Key projects:** Fraud Detection Pipeline (FastAPI + XGBoost + MLflow + Prometheus + Grafana + GitHub Actions CI/CD)
**Target companies:** CGI, Nuance/Microsoft, National Bank, Lightspeed, CAE, Sanofi, Amazon, Shopify, Coveo
**Cert in progress:** AWS SAA-C03
**Honest gap:** Kubernetes (60% of JDs), Terraform (40% of JDs)

---

## Recommended Execution Order for New Features

1. Read the target file fully before suggesting any edits
2. Reuse existing CSS classes before adding new ones
3. Match the existing color palette (use design tokens, not hardcoded colors)
4. Persist new interactive state to localStorage with a `nanthan_*_v1` key
5. Add new sections to `mlops-career.html` by incrementing the section number
