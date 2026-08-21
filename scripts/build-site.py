#!/usr/bin/env python3
"""Generate the parts of the site that come from data.

    python scripts/build-site.py           # write everything
    python scripts/build-site.py --check   # fail if anything would change

Reads `data/projects.json` and `data/posts.json` and writes:

  index.html   the projects section, the writing section and the JSON-LD block,
               each spliced between its own <!-- name:start --> / <!-- name:end -->
               markers. Everything outside the markers is left alone.
  llms.txt     a plain-text map of this site for language models.
  sitemap.xml  every page.
  robots.txt   crawl permissions, AI crawlers named explicitly.

Why a generator and not client-side rendering: GitHub Pages serves whatever is in
the repo, so the output is committed and the site stays a pile of static files
with no build step in the deploy path - the same arrangement
`assets/diagrams/build.py` already uses. The reason it matters is that text
painted in by JavaScript is invisible to AI crawlers, to text extractors and to
link-preview scrapers. Adding a project should not quietly remove it from the
places people now search.

Run `--check` in CI to catch a hand-edit that drifted from the data.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://nanthansr.github.io"
NAME = "Nanthan SR"
# One headline, used by the page, the JSON-LD and the profile README. If this
# changes, change it in docs/profile-README.md in the same commit.
JOB_TITLE = "Backend and ML Engineer"
BLURB = ("Backend and ML engineer in Montreal. I ship systems end to end, not notebooks. "
         "MSc Applied Computer Science, Concordia. Open to full-time backend, ML "
         "engineering, MLOps and AI automation roles.")
LINKEDIN = "https://www.linkedin.com/in/nanthan-sr/"
GITHUB = "https://github.com/nanthansr"
EMAIL = "nanthansr@gmail.com"

PAGES = ["/", "/case-fraud-pipeline.html"]


def e(s: str) -> str:
    return html.escape(s, quote=True)


def load(name: str) -> dict:
    return json.loads((ROOT / "data" / name).read_text(encoding="utf-8"))


# ---------------------------------------------------------------- projects ---
def project_html(projects: list[dict]) -> str:
    """One <article> per project. Real headings, real prose, real links.

    The old version of this section was a five-second auto-cycling carousel whose
    text lived in data- attributes and got painted in by JS. A reader got five
    seconds per project and a crawler got empty divs. A grid fixes both and costs
    nothing to extend.
    """
    out = []
    for p in projects:
        cs = p.get("case_study")
        links = [f'<a class="proj-link" href="{e(p["repo"])}" '
                 f'target="_blank" rel="noopener">Code on GitHub &rarr;</a>']
        if cs:
            links.insert(0, f'<a class="proj-link proj-link-primary" href="{e(cs)}">'
                            f'Read the case study &rarr;</a>')
        facts = "\n".join(f"          <li>{e(f)}</li>" for f in p["facts"])
        tags = "\n".join(f'          <li>{e(t)}</li>' for t in p["stack"])
        stem = p["image"]
        out.append(f"""      <article class="proj-card reveal" id="project-{e(p["slug"])}">
        <figure class="proj-figure proj-figure-{e(p.get("accent", "mlops"))}">
          <picture>
            <source media="(prefers-color-scheme: dark)" srcset="{e(stem)}-dark.svg" />
            <img src="{e(stem)}-light.svg" loading="lazy" decoding="async"
                 alt="{e(_alt(stem))}" />
          </picture>
        </figure>
        <div class="proj-body">
          <p class="proj-year"><time datetime="{e(p["year"])}">{e(p["year"])}</time></p>
          <h3 class="proj-title">{e(p["title"])}</h3>
          <p class="proj-tagline">{e(p["tagline"])}</p>
          <p class="proj-summary">{e(p["summary"])}</p>
          <ul class="proj-facts">
{facts}
          </ul>
          <ul class="proj-stack">
{tags}
          </ul>
          <p class="proj-links">{" ".join(links)}</p>
        </div>
      </article>""")
    return "\n".join(out)


def _alt(stem: str) -> str:
    """Pull the alt text out of the generated SVG so it is written once.

    The diagram already carries a full description in its aria-label, written to
    describe the system rather than to say 'architecture diagram'. Copying it
    here by hand would be two descriptions to keep in sync.
    """
    svg = ROOT / f"{stem}-light.svg"
    if not svg.exists():
        raise SystemExit(f"missing diagram: {svg}. run: python assets/diagrams/build.py")
    m = re.search(r'aria-label="([^"]+)"', svg.read_text(encoding="utf-8"))
    return html.unescape(m.group(1)) if m else ""


# ----------------------------------------------------------------- writing ---
def writing_html(data: dict) -> str:
    pubs = "\n".join(
        f'      <p class="writing-pub"><a href="{e(p["url"])}" target="_blank" rel="noopener">'
        f'{e(p["name"])}</a> <span class="writing-platform">on {e(p["platform"])}</span><br />'
        f'<span class="writing-desc">{e(p["description"])}</span></p>'
        for p in data["publications"])
    items = "\n".join(
        f"""      <li class="writing-item">
        <time datetime="{e(p["date"])}">{e(p["date"])}</time>
        <a href="{e(p["url"])}" target="_blank" rel="noopener">{e(p["title"])}</a>
      </li>"""
        for p in data["posts"])
    return f"""{pubs}
    <ul class="writing-list">
{items}
    </ul>"""


# ----------------------------------------------------------------- json-ld ---
def jsonld(projects: list[dict], posts: dict) -> str:
    person = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": NAME,
        "jobTitle": JOB_TITLE,
        "description": BLURB,
        "url": SITE + "/",
        "email": f"mailto:{EMAIL}",
        "address": {"@type": "PostalAddress", "addressLocality": "Montreal",
                    "addressRegion": "QC", "addressCountry": "CA"},
        "alumniOf": {"@type": "CollegeOrUniversity", "name": "Concordia University"},
        "knowsAbout": sorted({t for p in projects for t in p["stack"]}),
        "knowsLanguage": ["Tamil", "English", "French"],
        "sameAs": [LINKEDIN, GITHUB] + [p["url"] for p in posts["publications"]],
        "seeks": {"@type": "Demand", "name": "Full-time backend, ML engineering, "
                                             "MLOps or AI automation roles in Canada"},
    }
    works = [{
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        "name": p["title"],
        "description": p["tagline"],
        "codeRepository": p["repo"],
        "programmingLanguage": p["stack"][0],
        "keywords": ", ".join(p["stack"]),
        "author": {"@type": "Person", "name": NAME, "url": SITE + "/"},
        **({"url": f"{SITE}/{p['case_study']}"} if p.get("case_study") else {}),
    } for p in projects]
    blogs = [{
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": p["name"],
        "url": p["url"],
        "author": {"@type": "Person", "name": NAME, "url": SITE + "/"},
    } for p in posts["publications"]]
    blocks = [person, *works, *blogs]
    return "\n".join(
        '  <script type="application/ld+json">\n  '
        + json.dumps(b, indent=2, ensure_ascii=False).replace("\n", "\n  ")
        + "\n  </script>" for b in blocks)


# ---------------------------------------------------------------- llms.txt ---
def llms_txt(projects: list[dict], posts: dict) -> str:
    """A plain-markdown map of this site, for language models reading it directly.

    Same facts as the page, no navigation and no styling to wade through. Kept
    generated so it cannot drift from what the page says.
    """
    lines = [
        f"# {NAME}",
        "",
        f"> {BLURB}",
        "",
        f"- Site: {SITE}/",
        f"- GitHub: {GITHUB}",
        f"- LinkedIn: {LINKEDIN}",
        f"- Email: {EMAIL}",
        f"- Location: Montreal, Quebec, Canada",
        f"- Languages: Tamil (native), English (advanced), French (B1, working toward B2)",
        "",
        "Every number below is reproducible from the linked repository. Nothing here",
        "is an estimate presented as a measurement.",
        "",
        "## Projects",
        "",
    ]
    for p in projects:
        lines += [f"### {p['title']} ({p['year']})", "",
                  f"{p['tagline']}.", "", p["summary"], ""]
        lines += [f"- {f}" for f in p["facts"]]
        lines += ["", f"- Stack: {', '.join(p['stack'])}", f"- Repository: {p['repo']}"]
        if p.get("case_study"):
            lines.append(f"- Case study: {SITE}/{p['case_study']}")
        lines.append("")
    lines += ["## Writing", ""]
    for pub in posts["publications"]:
        lines.append(f"- [{pub['name']}]({pub['url']}) on {pub['platform']} - {pub['description']}")
    lines.append("")
    for p in posts["posts"]:
        lines.append(f"- {p['date']}: [{p['title']}]({p['url']})")
    lines += ["", "## Pages", ""]
    for pg in PAGES:
        lines.append(f"- {SITE}{pg}")
    lines.append("")
    return "\n".join(lines)


# ------------------------------------------------------------------- robots ---
AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-Web",
               "anthropic-ai", "PerplexityBot", "Google-Extended", "CCBot",
               "Applebot-Extended", "Bytespider", "meta-externalagent"]


def robots_txt() -> str:
    lines = ["# Everything here is meant to be read, by people and by machines alike.",
             "", "User-agent: *", "Allow: /", ""]
    for bot in AI_CRAWLERS:
        lines += [f"User-agent: {bot}", "Allow: /", ""]
    lines += [f"Sitemap: {SITE}/sitemap.xml", ""]
    return "\n".join(lines)


def sitemap_xml() -> str:
    today = date.today().isoformat()
    urls = "\n".join(
        f"  <url>\n    <loc>{SITE}{p}</loc>\n    <lastmod>{today}</lastmod>\n  </url>"
        for p in PAGES)
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            f"{urls}\n</urlset>\n")


# -------------------------------------------------------------------- splice --
def splice(text: str, name: str, body: str) -> str:
    start, end = f"<!-- {name}:start -->", f"<!-- {name}:end -->"
    pat = re.compile(re.escape(start) + r".*?" + re.escape(end), re.S)
    if not pat.search(text):
        raise SystemExit(f"markers {start} / {end} not found in index.html")
    return pat.sub(f"{start}\n{body}\n{end}", text, count=1)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true",
                    help="exit 1 if any output would change; write nothing")
    args = ap.parse_args()

    pdata, wdata = load("projects.json"), load("posts.json")
    projects = pdata["projects"]

    index = ROOT / "index.html"
    src = index.read_text(encoding="utf-8")
    out = splice(src, "projects", project_html(projects))
    out = splice(out, "writing", writing_html(wdata))
    out = splice(out, "jsonld", jsonld(projects, wdata))

    targets = {
        index: out,
        ROOT / "llms.txt": llms_txt(projects, wdata),
        ROOT / "robots.txt": robots_txt(),
        ROOT / "sitemap.xml": sitemap_xml(),
    }

    stale = []
    for path, body in targets.items():
        # sitemap carries today's date; comparing it would fail every new day.
        if path.name == "sitemap.xml" and path.exists() and args.check:
            continue
        current = path.read_text(encoding="utf-8") if path.exists() else None
        if current != body:
            stale.append(path.relative_to(ROOT).as_posix())

    if args.check:
        if stale:
            print("out of date, run: python scripts/build-site.py", file=sys.stderr)
            for s in stale:
                print(f"  {s}", file=sys.stderr)
            return 1
        print("site output matches data/")
        return 0

    for path, body in targets.items():
        path.write_text(body, encoding="utf-8")
    print(f"wrote index.html, llms.txt, robots.txt, sitemap.xml "
          f"({len(projects)} projects, {len(wdata['posts'])} posts)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
