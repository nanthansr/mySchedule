#!/usr/bin/env bash
# Diff what GitHub actually serves against docs/VISIBILITY.tsv.
#
#     scripts/audit-visibility.sh
#
# The ledger records a public/private call and a reason for every repo Nanthan
# owns. It was written once on 2026-08-04 and then drifted, because nothing
# re-read it. This makes it a check rather than a document: exit 0 means the
# world matches the ledger, exit 1 lists every disagreement.
#
# Exit 1 is not automatically a problem to fix by flipping a repo. It means the
# ledger and reality disagree, and one of them has to be updated deliberately.
set -uo pipefail

LEDGER="$(dirname "$0")/../docs/VISIBILITY.tsv"
OWNER=nanthansr

command -v gh >/dev/null || { echo "gh not found" >&2; exit 2; }
[ -f "$LEDGER" ] || { echo "no ledger at $LEDGER" >&2; exit 2; }

live=$(mktemp) || exit 2
trap 'rm -f "$live"' EXIT
gh repo list "$OWNER" --limit 200 --json name,visibility \
  --jq '.[] | "\(.name)\t\(.visibility | ascii_downcase)"' | sort > "$live"

fail=0

# The ledger's `target` column is the intent. `now` is a historical note from
# when the row was written and is deliberately not checked.
while IFS=$'\t' read -r repo _now target _action _tier _reason; do
  [ "$repo" = "repo" ] && continue
  [ -z "${repo:-}" ] && continue

  actual=$(awk -F'\t' -v r="$repo" '$1==r {print $2}' "$live")

  if [ -z "$actual" ]; then
    if [ "$target" = "-" ]; then
      continue                      # ledger said delete, and it is gone
    fi
    echo "MISSING  $repo - ledger wants '$target', repo does not exist on GitHub"
    fail=1
  elif [ "$target" = "-" ]; then
    echo "UNDELETED $repo - ledger says delete, still $actual"
    fail=1
  elif [ "$actual" != "$target" ]; then
    echo "DRIFT    $repo - ledger says '$target', GitHub says '$actual'"
    fail=1
  fi
done < "$LEDGER"

# Anything live that the ledger has never heard of. A repo nobody decided about
# is the failure mode this whole file exists to catch.
while IFS=$'\t' read -r repo vis; do
  if ! awk -F'\t' -v r="$repo" '$1==r {found=1} END {exit !found}' "$LEDGER"; then
    echo "UNLISTED $repo ($vis) - not in the ledger, no call recorded"
    fail=1
  fi
done < "$live"

[ "$fail" -eq 0 ] && echo "ledger matches GitHub"
exit "$fail"
