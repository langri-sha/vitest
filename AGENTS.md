# Agents orientation — `langri-sha/vitest`

`@langri-sha/vitest` re-exports Vitest, together with `nock` and tempy's
`temporaryDirectory`, so tests import their helpers from one place. The package
is the repository root.

## Who owns which file

Projen writes `package.json` and every file listed in `.projen/files.json`; they
are read-only. Change them in `.projenrc.ts`, then run `pnpm exec projen`.
Beachball owns `CHANGELOG.md`, `CHANGELOG.json` and the `version` field.
Everything else — `src/`, `readme.md`, `.github/workflows/`, this file — is
edited by hand. Repository settings, branch protection and the Actions secrets
are managed by `langri-sha/github-repos`.

## Common tasks

```sh
pnpm install
pnpm exec projen                        # re-synthesize from .projenrc.ts
pnpm tsc --build .                      # typecheck
pnpm eslint . && pnpm prettier --check .
pnpm change                             # write a change file
```

There are no tests.

## Vitest is a peer and a devDependency

`vitest` is a peer, so tests run on their consumer's Vitest. It is also a
devDependency at the current release, because the build compiles against its
types: `src/index.ts` re-exports it, so the repository builds against newer
releases as Renovate moves it. `nock` and `tempy` are dependencies, pinned. The
ESLint, Prettier, lint-staged and `@langri-sha/tsconfig` configs come from npm,
pinned too.

## Release

Beachball versions the package. Anything that reaches the tarball or builds it —
`src/`, `readme.md`, `package.json`, `tsconfig.build.json` — needs a change file
in the same pull request: run `pnpm change`. Use `none` for edits that shouldn't
cut a release on their own, such as readme-only changes. Root tooling is exempt;
`beachball.config.cjs` lists it, so lock file maintenance never cuts a release.
On Renovate pull requests that touch the package, CI writes a `patch` change
file itself.

Nothing publishes on merge. Run the Release workflow (`publish.yml`) from the
Actions tab to publish the pending change files through npm trusted publishing.
It tags the version `v<version>` and creates a GitHub release with generated
notes; a tag that already has a release is skipped, so the workflow is safe to
rerun. Beachball's own `gitTags` stays off, since it would name the tags
`@langri-sha/vitest_v<version>`.

`main` points at `src/index.ts` in the repository, and `publishConfig` points
`main` and `types` at `dist/`, which `prepublishOnly` builds. The tarball ships
`src/` beside `dist/`, which the declaration maps point into.

There is deliberately no `engines` field. Published from the root, it would bind
consumers to the Node.js release this repository is developed on, so that lives
in `devEngines`, where `actions/setup-node` reads it.
