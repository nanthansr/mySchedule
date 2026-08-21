# nanthansr.github.io

My portfolio. Live at **<https://nanthansr.github.io/>**.

Next.js static export - every word is in the served HTML at build time.
Content lives in `data/*.json` (one file per content type); the pages, the
JSON-LD, `llms.txt`, `robots.txt`, and the sitemap all generate from it.

| Path | What |
|---|---|
| `app/` | pages: home, `/library` (interactive 3D bookshelf), machine-readable routes |
| `components/` | sections and interactive pieces |
| `lib/` | data loaders, SEO generators, the shelf engine (`lib/shelf/`, adapted from [mint-playground](https://github.com/mintdotgg/mint-playground), MIT) |
| `data/` | all site content, also served at `/data/` as a machine-readable feed |
| `public/case-fraud-pipeline.html` | deep walkthrough of the MLOps fraud-detection pipeline |
| `scripts/` | diagram generator, export gate, pre-publish verification |
| `docs/` | working notes, never published |

## Run it locally

```
npm install
npm run dev
```

## Verify

```
npm run build && node scripts/check-export.mjs   # the machine gate
bash scripts/verify-surface.sh --local            # + every public URL checked
```

## Deploy

Pushing to `main` builds, gates, and publishes via GitHub Actions
(`.github/workflows/deploy.yml`). Rollback: `docs/ROLLBACK.md`.

## Elsewhere

[GitHub](https://github.com/nanthansr) ·
[LinkedIn](https://www.linkedin.com/in/nanthan-sr/) ·
nanthansr@gmail.com
