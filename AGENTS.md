# Agents orientation — `langri-sha/vitest`

`@langri-sha/vitest` re-exports Vitest, together with `nock` and tempy's
`temporaryDirectory`, so tests import their helpers from one place. The package
is the repository root.

## Who owns which file

| Owner                                   | Files                                                                                                                                                                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Projen (`.projenrc.ts` → `pnpm projen`) | `package.json`, `.projen/`, `tsconfig*.json`, `pnpm-workspace.yaml`, `renovate.json5`, `beachball.config.cjs`, the ESLint, Prettier and lint-staged configs, `.husky/`, the ignore and attribute files, `CODEOWNERS`, `license` |
| Beachball                               | `CHANGELOG.md`, `CHANGELOG.json` and the `version` field                                                                                                                                                                        |
| You                                     | `src/**`, `readme.md`, `.github/workflows/`, this file                                                                                                                                                                          |

Synthesized files are read-only; change them in `.projenrc.ts`. Repository
settings, branch protection and the Actions secrets are managed by
`langri-sha/github-repos`.

## Common tasks

```sh
pnpm install
pnpm projen                             # re-synthesize from .projenrc.ts
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

Beachball versions the package and the Release workflow publishes it through npm
trusted publishing. Anything that reaches the tarball or builds it — `src/`,
`readme.md`, `package.json`, `tsconfig.build.json` — needs a change file in the
same pull request. Root tooling does not: `beachball.config.cjs` lists what is
exempt, so lock file maintenance never cuts a release.

The Release workflow calls the shared Packages workflow with
`tag-template: v{version}`, which tags each published version, e.g. `v0.2.0`,
and `github-releases: true`, which creates a GitHub release with generated notes
for it. Beachball's own `gitTags` stays off, since it would name the tags
`@langri-sha/vitest_v0.2.0`. A tag that already has a release is skipped, so the
workflow is safe to rerun.

`main` points at `src/index.ts` in the repository, and `publishConfig` swaps
`main` and `types` for `dist/`, which `prepublishOnly` builds. The tarball ships
`src/` beside `dist/`, which the declaration maps point into.

There is deliberately no `engines` field. Published from the root, it would bind
consumers to the Node.js release this repository is developed on, so that lives
in `devEngines`, where `actions/setup-node` reads it.
