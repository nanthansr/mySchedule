#!/usr/bin/env bash
# The gate that runs before anything public ships - a LinkedIn post, a resume
# send, a repo flipped to public.
#
#     scripts/verify-surface.sh            # check the live site
#     scripts/verify-surface.sh --local    # check the built export (run `npm run build` first)
#
# Four things, in the order they cost credibility:
#   1. every URL resolves          - the flagship demo sat at 401 for weeks
#   2. the export matches data/    - check-export.mjs, v2's drift gate
#   3. the ledger matches GitHub   - a repo public that nobody decided on
#   4. no fabricated numbers came back   - the site once claimed 99.2% uptime
#
# Exit 0 means the surface is consistent. It cannot tell you a claim is true;
# only that nothing here contradicts anything else here.
set -uo pipefail

cd "$(dirname "$0")/.." || exit 2
LOCAL=0
[ "${1:-}" = "--local" ] && LOCAL=1

if [ ! -f out/index.html ]; then
  echo "out/index.html missing - run: npm run build"
  exit 2
fi

# LinkedIn answers 999 and Hashnode 403 to anything that looks like a bot, so a
# browser UA is the only way to tell a block from a dead link.
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
fail=0
step() { printf "\n== %s\n" "$1"; }

# One retry on a 5xx or a connection failure. GitHub Pages returns a transient
# 503 often enough that without this the check flaps, and a gate that cries wolf
# is a gate nobody reads.
code_for() {
  local c
  c=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 20 -A "$UA" "$1")
  case "$c" in
    5??|000) sleep 3; c=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 20 -A "$UA" "$1") ;;
  esac
  printf '%s' "$c"
}

step "URLs"
# Sources of truth for what is linked publicly - the built export, not the
# source tree, because the export is what visitors get. The exclusion class
# also stops on < and \ so URLs inside minified HTML and the React payload
# don't run together.
urls=$(grep -ohE 'https?://[^)"'"'"'<> \\]+' out/index.html out/library/index.html out/llms.txt docs/profile-README.md 2>/dev/null \
       | sed -e 's/[.,]$//' -e 's/&amp;/\&/g' | sort -u \
       | grep -vE 'schema\.org|sitemaps\.org|w3\.org|fonts\.(googleapis|gstatic)\.com|localhost')
# Before deploy, this site's own absolute URLs (e.g. /library/) don't exist
# on the live origin yet - the live-mode step covers them after go-live.
if [ "$LOCAL" -eq 1 ]; then
  urls=$(grep -v 'nanthansr\.github\.io' <<< "$urls")
fi
# Checked in parallel; sequential runs blew the 60s AIOS goal budget. -P 4:
# 8-way fan-out flaked with connection failures on Windows Git Bash.
export -f code_for
export UA
bad=$(printf '%s
' "$urls" | xargs -P 4 -I{} bash -c '
  c=$(code_for "{}")
  case "$c" in
    200|999) ;;                         # 999 is LinkedIn'"'"'s anti-bot answer
    *) echo "  BAD $c  {}" ;;
  esac
')
if [ -n "$bad" ]; then
  printf '%s
' "$bad"
  fail=1
else
  echo "  all $(wc -l <<< "$urls") URLs resolve"
fi

step "export matches data/"
node scripts/check-export.mjs || fail=1

step "visibility ledger"
bash scripts/audit-visibility.sh || fail=1

if [ "$LOCAL" -eq 0 ]; then
  step "live site"
  for path in / /library/ /case-fraud-pipeline.html /llms.txt /robots.txt /sitemap.xml /resume.pdf /data/projects.json; do
    code=$(code_for "https://nanthansr.github.io$path")
    [ "$code" = "200" ] || { echo "  BAD $code  $path"; fail=1; }
  done
  # The whole point of static export: the project text has to be in the bytes
  # the server sends, not painted in afterwards by JavaScript.
  n=$(curl -s -L -A "$UA" https://nanthansr.github.io/ | grep -o '<article' | wc -l)
  if [ "$n" -lt 5 ]; then
    echo "  only $n <article> elements in the served HTML - is it JS-rendered?"
    fail=1
  else
    echo "  $n projects present in the served HTML"
  fi
fi

printf "\n"
[ "$fail" -eq 0 ] && echo "surface verified" || echo "surface NOT verified"
exit "$fail"
