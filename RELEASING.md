# Releasing

Only maintainers with release authority should perform these steps.

## One-time repository setup

1. Enable protected `main` branch checks for the generator and generated matrix.
2. Enable GitHub private vulnerability reporting.
3. In npm, require two-factor authentication and configure this repository's
   `release.yml` workflow as a trusted publisher for `nextjs-boilerplate-kit`.
4. Create an npm automation/granular token only as an emergency fallback; do not
   store a long-lived publish token when trusted publishing is available.
5. Confirm the npm package has the correct maintainers, repository, homepage,
   license, description, and public access.

## Release checklist

1. Update `CHANGELOG.md` and remove the released items from `Unreleased`.
2. Set the version with `npm version` using SemVer.
3. Run the full Node.js 24 gate:

   ```bash
   npm ci
   npm test
   npm run test:matrix:full
   npm pack --dry-run
   ```

4. Inspect the dry-run file list for secrets, internal notes, unexpected
   binaries, and missing license/notices.
5. Merge the reviewed release commit to `main`.
6. Create a signed `vX.Y.Z` tag and GitHub Release from the same commit.
7. Publishing is triggered by the GitHub Release and uses npm provenance.
8. Verify `npm view nextjs-boilerplate-kit version dist.integrity repository`
   and generate a smoke-test application from the published version.

Do not publish from an uncommitted worktree or bypass a failed matrix. If a
release must be withdrawn, deprecate the npm version with a clear replacement;
avoid unpublishing packages that consumers may already depend on.
