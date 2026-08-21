# Rolling back v2 to the v1 static site

Two steps, in this order. Both are needed - one is git, one is a GitHub
setting that git cannot see.

## 1. Revert the code

```bash
git revert -m 1 <merge-commit-sha>
git push origin main
```

`<merge-commit-sha>` is the merge commit that landed `v2-next` on `main`
(`git log --merges -1` right after go-live). Because go-live used a merge
commit (not a squash), this restores `main` byte-for-byte to v1, including
`index.html` and `_config.yml`.

## 2. Flip Pages back to branch serving

GitHub repo > Settings > Pages > Build and deployment > Source:
**"Deploy from a branch"**, branch `main`, folder `/ (root)`.

This undoes the "GitHub Actions" source set at v2 go-live. Until it is
flipped, Pages keeps serving the last Actions deployment no matter what
`main` contains.

## Verify

```bash
bash scripts/verify-surface.sh   # live mode - on the reverted main this is the v1 script again
curl -s https://nanthansr.github.io/ | grep -c '<article'   # expect 5
```

## Nuclear option

If the revert is messy, `v1-static` is the immutable tag of the last v1
commit:

```bash
git checkout main
git rm -r --cached . && git checkout v1-static -- .
git commit -m "Restore v1 static site from v1-static tag"
git push origin main
```

Then do step 2.
