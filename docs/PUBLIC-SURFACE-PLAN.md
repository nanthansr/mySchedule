# Public surface plan - 2026-08-20

Everything a hiring manager or client can see, brought to one standard before the
first Culprit post goes on LinkedIn.

## Context

On 2026-08-04 the job search became Tier 0 and "GitHub + portfolio rebuild" was
promoted to Tier 1 (`~/AIOS/decisions/log.md`). Between 08-04 and 08-06 a large
chunk of that shipped on the Mac and is still here:

- `docs/VISIBILITY.tsv` - a 28-repo public/private ledger, each call with a reason.
- `docs/repo-readme-standard.md` - the README shape every showcase repo uses.
- `docs/profile-README.md` - source of truth for `nanthansr/nanthansr`.
- `CLAUDE.md` - the governing doc, including the honesty rule.
- `index.html` - the site, rebuilt and promoted from `portfolio.html`.

Then it stopped. Roughly 80% of the ledger was executed and the site has not been
touched in 14 days. Now Culprit is public and about to get its first real traffic
from a LinkedIn post, so the whole surface needs to be finished, not restarted.

No record was found of the example GitHub profile that was used as a model. The
profile README that exists already reflects it; treat it as absorbed.

## What is actually broken

**Ledger drift.** `YTMusicUltimate` is still a public fork the ledger says to
delete. `scAnki` -> `carnet-snap` is still blocked on a `.env` purge and key
rotation. `culprit` is public and not in the ledger at all.

**The portfolio invents numbers.** The three project "screenshots" in
`index.html` are hand-coded fake dashboards. Slide 1 displays `0.87 AUC-PR`,
`18ms`, `99.2% uptime`. The profile README says 2-5 ms. Nothing measures uptime.
`CLAUDE.md` says: *"Screenshots are of real running instances. Never a mockup,
never a doctored number."* The site breaks its own load-bearing rule.

**The portfolio links to no code.** Every external link on the page is one of:
the GitHub profile root, the blog, LinkedIn. Not one repo URL. A visitor who
wants to read code cannot get there.

**It showcases a repo nobody can open.** Carnet Snap is slide 2; `scAnki` is
private.

**Adding a project costs ~40 lines of bespoke markup.** Each slide is a
hand-built fake UI of inline-styled divs. This is the direct blocker on
"make it easy to add future projects".

**The project text is invisible to machines.** Titles and descriptions live in
`data-title` / `data-sub` attributes on `<div>`s and are painted in by JS. A text
extractor, an AI crawler, and GitHub's OG scraper all see empty divs.

**No AI-readable surface.** `robots.txt`, `sitemap.xml`, `llms.txt` all 404.
JSON-LD is one thin `Person` block whose `jobTitle` ("Cloud & MLOps Engineer")
contradicts the profile README headline ("Backend and ML engineer").

**No writing section.** One blog link in the footer. Substack absent entirely.

**Culprit is not shippable-to-strangers yet.** No LICENSE (so legally all rights
reserved), no CI (on a tool whose entire pitch is that it runs in CI), no topics,
no homepage, `docs/linkedin-post.txt` committed inside the repo, and
`.culprit/baseline.json` committed with an empty `git_sha`.

---

## Step 1 - Culprit to standard (blocks the post)

Repo: `~/Workspace/toolshed/03-culprit`. Against `docs/repo-readme-standard.md`.

1. `LICENSE` - MIT, matching `01-gavel`.
2. `.github/workflows/ci.yml` - pytest on 3.11 and 3.12, badge in the README.
3. `gh repo edit nanthansr/culprit --add-topic ...` (langgraph, ai-agents,
   ci-cd, testing, python, llm-evaluation) and `--homepage` once the case-study
   page exists.
4. Move `docs/linkedin-post.txt` out of the repo. Marketing drafts inside the
   product read as scaffolding. Destination: `~/AIOS/projects/linkedin/drafts/`.
5. Fix the empty `"git_sha": ""` in `.culprit/baseline.json`.
6. Secret scan before traffic arrives (`gitleaks detect --no-git`; install first).
7. Curl every URL in the README.

**Open call for Nanthan:** `attribute()` in `culprit/attribution.py` raises
`NotImplementedError`, and five tests skip around it. The shipped tool runs the
strawman it argues against. A reader who opens the main module finds the hole.
Either implement it before the post, or move the "this is the open problem"
framing from the bottom of the README to the top so nobody discovers it alone.

**Predicate:** `pytest` green in CI, `gh repo view nanthansr/culprit --json
licenseInfo,repositoryTopics,homepageUrl` all non-empty, gitleaks zero findings,
every README URL returns 200.

## Step 2 - Portfolio: real evidence, data-driven projects

The two problems have one fix: move projects out of hand-built markup into data.

**2a. A single project record.** One `<article>` per project, generated from one
entry in `data/projects.json`: slug, title, one-line hook, 3-5 reproducible
facts, stack tags, repo URL, case-study URL, image paths, status. Adding a future
project = add an entry, run one command, commit. That is the whole workflow.

**2b. Static output, not client-side rendering.** A ~60-line
`scripts/build-projects.py` reads the JSON and writes real HTML between
`<!-- projects:start -->` / `<!-- projects:end -->` markers in `index.html`. The
generated HTML is committed. GitHub Pages still serves plain static files with no
build step - the generator is a local authoring tool, the same way
`assets/diagrams/build.py` already is. This keeps the CLAUDE.md "no framework, no
bundler" constraint and is *required* for step 4: JS-rendered text is invisible to
AI crawlers.

**2c. Kill the fabricated dashboards.** Replace each fake mock-UI with one of: a
real screenshot of the thing running, or the hand-authored SVG architecture
diagram (three pairs already exist in `assets/diagrams/`). No number appears that
cannot be reproduced from a repo. Culprit ships with a real `docs/demo.gif`
rendered from actual CLI output - use it.

**2d. Every project links to its repo.** And drop Carnet Snap until `carnet-snap`
is actually public.

**Initial roster:** Culprit, MLOps fraud pipeline (flagship, keeps its case
study), Pomofocus, Visual Français, AWS two-tier. Gavel when day 2 lands.

**Predicate:** `python scripts/build-projects.py --check` reports no diff;
`grep -c 'github.com/nanthansr/' index.html` >= 5; `99.2%` and `18ms` return zero
hits.

## Step 3 - Writing section

New `#writing` section on `index.html`, driven by `data/posts.json` through the
same generator. Hashnode posts (currently ~6 months stale, honestly labelled by
date) and Substack.

Deliberately **manual, not auto-fetched**: a client-side fetch of the Hashnode API
would make the posts invisible to exactly the AI crawlers step 4 is for, and would
break silently. Adding a post is one JSON line, same as a project.

Same links added to the profile README's Writing section, which currently lists
three post titles with no URLs on them.

**Predicate:** every post URL returns 200; Substack and Hashnode both reachable
from the site, the profile README, and the JSON-LD `sameAs`.

## Step 4 - AI readability

The goal: an LLM asked "who is Nanthan SR and what has he built" gets a correct,
specific answer from public sources.

1. **`llms.txt`** at the site root - the emerging convention for this. A plain
   markdown map: who he is, what he is looking for, one line and one URL per
   project, links to the blogs and repos. Generated from the same JSON, so it
   cannot drift from the page.
2. **`robots.txt`** explicitly allowing `GPTBot`, `ClaudeBot`, `PerplexityBot`,
   `Google-Extended`, `CCBot`. Right now there is no file, which most crawlers
   read as allow-all, but stating it removes the ambiguity.
3. **`sitemap.xml`** - three URLs today, generated.
4. **JSON-LD expansion** - keep `Person`, add a `SoftwareSourceCode` entry per
   project and `Blog` entries for Hashnode and Substack, all from the same JSON.
   Fix `jobTitle` to match the README headline exactly.
5. **Semantic HTML** - real `<article>`, `<h3>`, `<time>`, `<p>` in the generated
   output instead of `data-*` attributes on divs. Descriptive `alt` text that
   describes the system, per the existing standard.

**Predicate:** `curl -s https://nanthansr.github.io/llms.txt | head -1` returns
content; robots.txt and sitemap.xml return 200; `curl -s <site> | grep -c
'<article'` >= 5 (proves the text is in the served HTML, not painted in by JS).

## Step 5 - Profile README refresh

Source of truth stays `docs/profile-README.md`, copied into `nanthansr/nanthansr`.

- Add **Culprit** as a second flagship section above "Also built".
- Add Substack alongside Hashnode; put real URLs on the three post titles.
- Reconcile the headline with the site's JSON-LD `jobTitle`.
- Re-curl every link before it ships. (Per CLAUDE.md: never link without curling.)

## Step 6 - Reconcile the ledger

`docs/VISIBILITY.tsv` is the record, and it has drifted.

1. Write `scripts/audit-visibility.sh`: diff `gh repo list nanthansr` against the
   TSV, print every mismatch. Re-runnable, not a one-off.
2. Add rows for `culprit`, `gavel`, and the specced toolshed projects.
3. Execute the two outstanding calls:
   - `YTMusicUltimate` - ledger says delete (a fork of someone else's iOS tweak,
     dilutes the language stats). **Destructive, needs an explicit go.**
   - `scAnki` -> `carnet-snap` - still blocked on purging `.env` from history and
     rotating both keys. Either do that work or record the deferral.

**Predicate:** `scripts/audit-visibility.sh` exits 0 with no mismatches.

## Step 7 - Verify the whole surface

One script, `scripts/verify-surface.sh`, run before the LinkedIn post:

- every URL in `index.html`, `docs/profile-README.md`, and each showcase README
  returns 200
- `html5validator` green (the existing workflow)
- `scripts/audit-visibility.sh` clean
- `scripts/build-projects.py --check` clean
- `gitleaks detect --no-git` zero findings in every public repo
- fetch the live site and confirm the project text is present in raw HTML

Only then does the Culprit post go out.

## Order and rough size

| Step | Why this order | Size |
|---|---|---|
| 1 Culprit | Hard blocker on the post | ~1h |
| 2 Portfolio projects | Biggest change; everything downstream reads its JSON | ~3h |
| 3 Writing | Needs the generator from step 2 | ~45m |
| 4 AI readability | Needs the static HTML from step 2 | ~1h |
| 5 Profile README | Needs Culprit finished | ~30m |
| 6 Ledger | Independent, can slot anywhere | ~45m |
| 7 Verify | Gate on the post | ~30m |

## Also worth knowing

`CLAUDE.md` in this repo is stale on two points: it lists design tokens
(`--accent: #c9773a`, Playfair Display / DM Sans) that `index.html` no longer uses
(`--accent: #4B9EFF`, Syne / Space Grotesk), and it describes a `profile/`
gitignored checkout. Fix in passing during step 5.
