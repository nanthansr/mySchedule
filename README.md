# mySchedule

Personal portfolio workspace with three core private-use pages:
- `mobile.html` - daily schedule view optimized for phone
- `projects.html` - dynamic project vault (add/edit/delete/search)
- `mlops-career.html` - MLOps career brief

`index.html` remains the public-facing entry page.

## Quick Start

1. Clone the repo.
2. Open the folder in VS Code.
3. Open `index.html` (public) or `mobile.html` / `projects.html` / `mlops-career.html` directly in a browser.

No build step is required. This is a static HTML/CSS/JS site.

## Page Navigation

The three private pages are cross-linked so you can jump between them quickly:
- Schedule (`mobile.html`)
- Projects (`projects.html`)
- Career (`mlops-career.html`)

## Projects Page Features

`projects.html` includes:
- tabbed views (`All`, `Professional`, `Experiments`)
- add project form
- edit notes and status from modal
- delete projects
- search/filter by title, tags, description, notes, and status
- reset to default projects action
- lightweight success toasts for add/save/delete

## Data Storage

By default, project data is stored in browser `localStorage`.

This means:
- works offline on your phone/laptop
- fast and private per browser
- not shared between devices unless sync is configured

## Cross-Device Sync (GitHub Gist)

`projects.html` supports optional sync using a private GitHub Gist.

### One-time setup

1. Create a **private gist** on GitHub.
2. Copy the gist ID from the URL.
3. Create a GitHub token with `gist` scope.
4. Open `projects.html`.
5. Click `Setup Sync`.
6. Enter token and gist ID.

### Daily use

- After changes on device A: click `Sync Now` (push)
- On device B: click `Sync Now` (pull)

The sync file name stored in your gist is `projects-vault.json`.

## Security Note

The sync token is saved in browser localStorage on each device for convenience.
Use a token with minimal scope (`gist`) and rotate/revoke it if needed.

## Repo Structure

- `index.html`
- `mobile.html`
- `projects.html`
- `mlops-career.html`
- `README.md`
