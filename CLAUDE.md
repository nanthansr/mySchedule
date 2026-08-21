# CLAUDE.md - portfolio

This directory owns **everything public-facing about Nanthan as an engineer**.
Repo: `nanthansr/nanthansr.github.io`, served at <https://nanthansr.github.io/>.

v2 (2026-08-21): rebuilt from a hand-written static HTML site into a Next.js
static export, on the `v2-next` branch. The last v1 commit is tagged
`v1-static`; `docs/ROLLBACK.md` is the way back. The v1 CLAUDE.md said "no
framework, no bundler" - that constraint was retired deliberately with this
rebuild; do not resurrect it, and do not treat pre-v2 docs as current on
stack questions.

## Scope: what this directory owns

1. **The portfolio site** - the Next.js app (`app/`, `components/`, `lib/`), plus `public/case-fraud-pipeline.html`.
2. **The GitHub profile README** - source of truth is `docs/profile-README.md`; `profile/` is a gitignored checkout of `nanthansr/nanthansr` that it gets copied into.
3. **The visibility ledger** - `docs/VISIBILITY.tsv`. Every repo Nanthan owns, its public/private call, and the reason.
4. **The README standard** - `docs/repo-readme-standard.md`, applied to every showcase repo.
5. **The diagram pipeline** - `scripts/build-diagrams.py` renders the hand-authored SVG pairs into `public/assets/diagrams/`.

If a task touches how Nanthan looks to a hiring manager, it belongs here.

## Positioning

Audience is **hiring managers and recruiters first, build-in-public audience second**.
Headline register: *"Backend and ML engineer. I ship systems end to end, not notebooks."*
`JOB_TITLE` lives in `lib/site.ts`; changing it requires mirroring
`docs/profile-README.md` in the same commit.

## The honesty rule

**No metric appears in any page, README, or profile that is not reproducible from the repo.**

Specificity is the substitute for scale: "284,807 transactions at a 577:1
imbalance, 2-5ms inference" beats any badge. Corollaries:

- Never claim a skill that is not demonstrated by a repo here.
- Never link a demo or URL without checking it returns 200 first.
- State the gaps. "No CI on this one" is a stronger signal than silence.
- `scripts/check-export.mjs` greps every exported HTML file for retired fabricated figures; do not teach it exceptions.

## Stack and architecture (v2)

- Next.js (app router, `output: 'export'`), React, TypeScript, Tailwind 4, `motion` (Framer Motion), three.js (library page only), next-themes.
- **All meaningful text must be in the exported HTML.** Content renders in server components at build time; client components are for interaction only. The export gate asserts this.
- **One data file per content type**: `data/projects.json`, `posts.json`, `skills.json`, `experience.json`, `life.json`. Page sections render from these; never hand-edit content into components. `data/*.json` are also served publicly at `/data/` (synced by the prebuild hook) as a machine-readable feed.
- The AI-readability surface (`llms.txt`, `robots.txt` with 12 named crawlers, `sitemap.xml`, 7 JSON-LD blocks) generates from the same data in `lib/` + `app/*/route.ts`.
- Design tokens live in `:root` in `app/globals.css` (black `#000`, blue `#4B9EFF`, copper `#e8865a`, Space Grotesk + DM Mono via next/font). Do not introduce a second palette. The case study page keeps its own separate system on purpose.
- The `/library` shelf engine (`lib/shelf/`) is adapted from mint-playground (MIT, commit-pinned headers, `licenses/mint-playground.LICENSE`). Never add Stripe-harvested assets to it; covers stay procedural. The gate greps for this.

## Adding a project

1. Add a `DIAGRAMS` entry in `scripts/build-diagrams.py`, then `python scripts/build-diagrams.py`. Alt text is authored as the SVG's `aria-label`.
2. Add an entry to `data/projects.json`. Every string in `facts` must be reproducible from the repo.
3. `npm run build && node scripts/check-export.mjs`.
4. Commit the JSON and the SVGs together. The library catalog picks the project up automatically (assign a motif in `lib/catalog.ts` if the default doesn't fit).

## Verification

- `npm run build` then `node scripts/check-export.mjs` - the machine gate (27 checks). CI runs it on every push.
- `bash scripts/verify-surface.sh --local` - pre-publish gate: every public URL curl-checked, export gate, visibility ledger.
- `bash scripts/verify-surface.sh` - same against the live site, after deploy.

## Deploy

GitHub Pages serves via the **Actions workflow** (`.github/workflows/deploy.yml`)
on pushes to `main` - build, gate, publish `out/`. Settings > Pages > Source
must be "GitHub Actions" (flipped manually at v2 go-live). Only `out/` ships,
so `docs/`, `scripts/`, and this file never reach the site - the gate asserts
it. Rollback: `docs/ROLLBACK.md`.

## Never

- Never push or merge to `main` unattended. Nanthan reviews and pushes; push to `main` deploys the live site.
- Never publish anything from `../dashboard/` (target-company lists, job tracker). That content leaked publicly for months before the 2026-08-04 split.
- Never commit a secret. Run `gitleaks detect --no-git` before flipping any repo to public.
- Never change a repo's visibility without recording the call in `docs/VISIBILITY.tsv`.
- Never weaken `scripts/check-export.mjs` to make a build pass.

## Logged follow-ups

- **Case-study metrics audit**: `public/case-fraud-pipeline.html` section 05 shows `0.87 AUC-PR / 0.94 AUC-ROC / <20ms p95 / 100% CI coverage`, flagged in `docs/PUBLIC-SURFACE-PLAN.md` as unverified. The page shipped byte-identical through the v2 rebuild; audit those numbers against the repo and fix or remove them.
- Optional: align `resume-backend.tex` headline ("Backend & Infrastructure Engineer") in the Automated Job Applications project with the site title, then re-export `public/resume.pdf`.
- Optional: replace emoji icons (skills/life/contact) with SVG icons.
- Orphaned diagram pairs (`multipaste`, `learn-buddy`) still render from `build-diagrams.py`; prune when convenient.
