# README standard for showcase repos

A recruiter spends about 30 seconds on a repo. The README has to answer
"can this person do the job" before they scroll. This is the shape every
showcase repo uses.

## The shape

```
# <repo name>

**<one-line hook - what it does and who for, no adjectives>**

[badges: CI, language, licence, live demo]

<hero image: architecture diagram or a real screenshot>

## The problem
2-4 sentences. What was actually hard. Not "I wanted to learn X".

## How it works
The path through the system, in order. Name the real components.
Reference the diagram.

## The numbers
Bullets. Every one reproducible from this repo. Dataset size, latency,
throughput, test count, imbalance ratio. No number you cannot point at.

## Run it
Three commands, maximum. Assume a clean machine.

## What I'd do next
Honest. The known gaps, named. This section is a strength signal, not a
weakness - it shows you know where the edges are.
```

## Rules

1. **One hero image above the fold.** A diagram if the value is architectural, a screenshot if the value is the product.
2. **Every number is reproducible.** If someone clones the repo and runs it, the figure holds. No estimates dressed as measurements.
3. **Every link gets curled before it ships.** The flagship demo sat at 401 for weeks because nobody checked.
4. **Name the gaps.** "Zero tests" is more credible than silence. So is "not claiming Kubernetes until it's solid".
5. **Set the `homepage` field**, not just the README link, so the demo shows in the repo sidebar: `gh repo edit <repo> --homepage <url>`.
6. **Add topics.** They drive GitHub search and they are free: `gh repo edit <repo> --add-topic <t>`.
7. **Write a description.** It is what shows in the profile repo list and in search results.

## Images

Diagrams live in `docs/img/` in each repo, copied from
`../portfolio/assets/diagrams/`. Ship them theme-aware so they read on
GitHub in light and dark:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/img/arch-dark.svg">
  <img alt="<describe the actual architecture, not 'architecture diagram'>"
       src="docs/img/arch-light.svg">
</picture>
```

Alt text describes the system, because that is what a screen reader and a
search index both need.

## Checklist before a repo ships

- [ ] `gitleaks detect --no-git` returns zero findings
- [ ] no tracked `.env` (`git ls-files | grep -E '^\.env$'` is empty)
- [ ] README over 500 bytes, has a hero image, has the numbers section
- [ ] description set
- [ ] at least three topics set
- [ ] `homepage` set if there is a demo
- [ ] every URL in the README returns 200
- [ ] row updated in `docs/VISIBILITY.tsv`
