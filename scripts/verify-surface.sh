#!/usr/bin/env bash
# The gate that runs before anything public ships - a LinkedIn post, a resume
# send, a repo flipped to public.
#
#     scripts/verify-surface.sh            # check the live site
#     scripts/verify-surface.sh --local    # check the working tree instead
#
# Four things, in the order they cost credibility:
#   1. every URL resolves          - the flagship demo sat at 401 for weeks
#   2. the generated HTML matches data/  - a hand-edit that drifted
#   3. the ledger matches GitHub   - a repo public that nobody decided on
#   4. no fabricated numbers came back   - the site once claimed 99.2% uptime
#
# Exit 0 means the surface is consistent. It cannot tell you a claim is true;
# only that nothing here contradicts anything else here.
set -uo pipefail

cd "$(dirname "$0")/.." || exit 2
LOCAL=0
[ "${1:-}" = "--local" ] && LOCAL=1

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
# Sources of truth for what is linked publicly.
urls=$(grep -ohE 'https?://[^)"'"'"'> ]+' index.html docs/profile-README.md llms.txt 2>/dev/null \
       | sed -e 's/[.,]$//' -e 's/&amp;/\&/g' | sort -u \
       | grep -vE 'schema\.org|sitemaps\.org|w3\.org|fonts\.(googleapis|gstatic)\.com')
while read -r u; do
  [ -z "$u" ] && continue
  code=$(code_for "$u")
  case "$code" in
    200|999) : ;;                       # 999 is LinkedIn's anti-bot answer
    *) echo "  BAD $code  $u"; fail=1 ;;
  esac
done <<< "$urls"
[ "$fail" -eq 0 ] && echo "  all $(wc -l <<< "$urls") URLs resolve"

step "generated output matches data/"
python scripts/build-site.py --check || fail=1

step "visibility ledger"
bash scripts/audit-visibility.sh || fail=1

step "no fabricated numbers"
# These three were on the site and in no repo. If any comes back, something
# regenerated from a stale source or someone hand-edited a mock-up back in.
if grep -nE '99\.2%|18ms|AUC-PR 0\.87|xgboost_v3' index.html case-fraud-pipeline.html 2>/dev/null; then
  echo "  a retired fabricated figure is back"
  fail=1
else
  echo "  clean"
fi

if [ "$LOCAL" -eq 0 ]; then
  step "live site"
  for path in / /llms.txt /robots.txt /sitemap.xml; do
    code=$(code_for "https://nanthansr.github.io$path")
    [ "$code" = "200" ] || { echo "  BAD $code  $path"; fail=1; }
  done
  # The whole point of generating rather than rendering: the project text has to
  # be in the bytes the server sends, not painted in afterwards by JavaScript.
  n=$(curl -s -L -A "$UA" https://nanthansr.github.io/ | grep -c '<article')
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
