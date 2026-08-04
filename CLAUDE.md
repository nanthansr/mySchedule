# CLAUDE.md - portfolio

This directory owns **everything public-facing about Nanthan as an engineer**.
Repo: `nanthansr/nanthansr.github.io`, served at <https://nanthansr.github.io/>.

Renamed from `mySchedule` on 2026-08-04. The private daily-use pages moved to
`../dashboard/` (repo `nanthansr/dashboard`, private, Cloudflare Access).

## Scope: what this directory owns

1. **The portfolio site** - `index.html` and the case-study pages.
2. **The GitHub profile README** - source of truth is `docs/profile-README.md`; `profile/` is a gitignored checkout of `nanthansr/nanthansr` that it gets copied into.
3. **The visibility ledger** - `docs/VISIBILITY.tsv`. Every repo Nanthan owns, its public/private call, and the reason. Re-runnable, not a one-off decision.
4. **The README standard** - `docs/repo-readme-standard.md`, applied to every showcase repo.
5. **The asset pipeline** - `assets/diagrams/*.svg` and `assets/shots/*.png`, copied into each showcase repo's `docs/img/`.

If a task touches how Nanthan looks to a hiring manager, it belongs here.

## Positioning

Audience is **hiring managers and recruiters first, build-in-public audience second**.
Per `~/AIOS/context/priorities.md`, Tier 0 is a full-time backend/ML role at a $70k
floor, measured in submissions sent. This surface exists to make those submissions land.

Headline register: *"Backend and ML engineer. I ship systems end to end, not notebooks."*

## The honesty rule

**No metric appears in any README, page, or profile that is not reproducible from the repo.**

This is the load-bearing rule. Nanthan has 2 stars and 2 followers. Portfolio formats
that work for people with 60K-star repos - star charts, press logos, manifesto badges,
follower counts - read as imitation when the proof underneath is absent, and that is
worse than a plain honest page. Specificity is the substitute for scale:
"284,807 transactions at a 577:1 imbalance, 2-5ms inference" beats any badge.

Corollaries:
- Never claim a skill that is not demonstrated by a repo here. The existing line "not claiming Kubernetes and Terraform until they're solid" is the standard.
- Never link a demo without checking it returns 200 first. The flagship demo sat at 401 for weeks.
- State the gaps. "Zero tests" on multipaste is a stronger signal than silence.

## Hard constraints (the site)

- **No framework, no bundler.** Pure HTML/CSS/JS. Never suggest React, Vue, npm, webpack.
- **No external JS libraries.** Vanilla JS only.
- **No backend.** Client-side only.
- **No TypeScript.** Plain `.js` inside `<script>` tags.
- **No new files** unless clearly required. Prefer editing existing ones.

## Files

| File | What |
|---|---|
| `index.html` | the portfolio (was `portfolio.html`) - dark, copper accent |
| `case-fraud-pipeline.html` | deep technical walkthrough of the flagship |
| `assets/diagrams/` | hand-authored SVG architecture diagrams |
| `assets/shots/` | real screenshots, never mockups |
| `assets/og-image.png` | social card, generated from the site itself |
| `docs/` | the portfolio programme - never published (excluded in the deploy workflow) |

### Design tokens for `index.html`

```
--bg: #07080f; --surface: #141728; --accent: #c9773a;
--font-disp: 'Playfair Display'; --font-mono: 'DM Mono'; --font-body: 'DM Sans'
```

Do not introduce a second palette. The dashboard pages have their own systems;
they are a different repo now and their tokens do not apply here.

## Asset rules

- Diagrams are **hand-authored SVG**, not exported images. They stay legible when scaled and diff cleanly in git.
- Every diagram ships as a `<picture>` with a `prefers-color-scheme: dark` source so it reads on GitHub in both themes.
- Screenshots are of **real running instances**. Never a mockup, never a doctored number.
- Assets live here first, then get copied into the showcase repo under `docs/img/` so each repo is self-contained.

## Deploy

Because the repo is named `nanthansr.github.io`, **GitHub Pages serves the `main`
branch root directly** at the bare root domain, with no path prefix and no deploy
action involved. Push to `main` and it is live. That is the URL that goes on the resume.

What gets published is controlled by `_config.yml`, not by a workflow. `docs`,
`CLAUDE.md`, `README.md` and `.github` are in its `exclude` list, so they stay in
git but never reach the site. **If you add anything to this repo that must not be
public, add it to that list in the same commit.**

The one workflow, `.github/workflows/deploy.yml`, only runs `html5validator`. It has
no deploy step; an earlier `peaceiris/actions-gh-pages` step was removed because it
published to a `gh-pages` branch that Pages was not reading.

## Never

- Never publish anything from `../dashboard/`. It holds target-company lists, a gap analysis, and a live job tracker. That content leaked publicly for months before the 2026-08-04 split; do not undo it.
- Never commit a secret. Run `gitleaks detect --no-git` before flipping any repo to public.
- Never change a repo's visibility without recording the call and its reason in `docs/VISIBILITY.tsv`.
- Never link a URL from the profile README without curling it first.
