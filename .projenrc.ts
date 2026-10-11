import { Project, TypeScriptConfig } from '@langri-sha/projen-project'

const project = new Project({
  name: '@langri-sha/vitest',
  package: {
    authorEmail: 'filip.dupanovic@gmail.com',
    authorName: 'Filip Dupanović',
    authorOrganization: false,
    authorUrl: 'https://langri-sha.com',
    bugsUrl: 'https://github.com/langri-sha/vitest/issues',
    copyrightYear: '2024',
    description:
      'Provides some useful helpers that are commonly used for authoring tests.',
    homepage: 'https://github.com/langri-sha/vitest#readme',
    keywords: ['nock', 'tempy', 'testing', 'vitest'],
    license: 'MIT',
    licensed: true,
    minNodeVersion: '24.16.0',
    peerDependencyOptions: {
      pinnedDevDependency: false,
    },
    repository: 'git+https://github.com/langri-sha/vitest.git',
    type: 'module',

    deps: ['nock@15.0.1', 'tempy@3.2.0'],
    devDeps: [
      '@langri-sha/eslint-config@0.9.19',
      '@langri-sha/lint-staged@0.9.10',
      '@langri-sha/prettier@0.4.11',
      '@langri-sha/projen-project@*',
      '@langri-sha/tsconfig@1.1.1',
      'vitest@5.0.3',
    ],
    peerDeps: ['vitest@^5.0.0'],
  },
  beachball: {
    config: {
      // The package is the repository root, so these would otherwise demand a
      // release for changes that never reach the tarball.
      ignorePatterns: [
        '.editorconfig',
        '.gitattributes',
        '.gitignore',
        '.prettierignore',
        '.projenrc.ts',
        'AGENTS.md',
        'CODEOWNERS',
        'beachball.config.cjs',
        'eslint.config.js',
        'lint-staged.config.js',
        'pnpm-lock.yaml',
        'pnpm-workspace.yaml',
        'prettier.config.js',
        'renovate.json5',
        'tsconfig.json',
      ],
    },
  },
  codeowners: {
    '*': '@langri-sha',
  },
  editorConfig: {},
  eslint: {},
  husky: {
    'pre-commit': 'lint-staged',
  },
  lintStaged: {},
  lintSynthesized: {},
  npmIgnore: {
    ignorePatterns: [
      '*.test.*',
      '__snapshots__/',
      '/*.config.*',
      '/*.json5',
      '/*.yaml',
      '/AGENTS.md',
      '/CODEOWNERS',
      '/change/',
    ],
  },
  pnpmWorkspace: {
    minimumReleaseAgeExclude: [
      '@langri-sha/*',
      'projen-babel-config',
      'projen-beachball',
      'projen-cargo',
      'projen-codeowners',
      'projen-dagger',
      'projen-editorconfig',
      'projen-eslint',
      'projen-husky',
      'projen-jest-config',
      'projen-license',
      'projen-lint-staged',
      'projen-lint-synthesized',
      'projen-pnpm-workspace',
      'projen-prettier',
      'projen-readme',
      'projen-renovate',
      'projen-ruff',
      'projen-skills',
      'projen-swcrc',
      'projen-ty',
      'projen-typescript-config',
      'projen-uv',
      'projen-worktrunk',
    ],
  },
  prettier: {},
  readme: {
    filename: 'readme.md',
  },
  renovate: {
    packageRules: [
      {
        description: 'Update our own packages together',
        groupName: 'langri-sha projen toolchain',
        groupSlug: 'langri-sha-projen',
        matchPackageNames: ['@langri-sha/**'],
      },
      {
        description: 'Install our own packages without waiting them out',
        matchPackageNames: ['@langri-sha/**'],
        minimumReleaseAge: null,
      },
      {
        description:
          'Install our own GitHub Actions and Terraform modules without waiting them out',
        matchPackageNames: ['langri-sha/**'],
        minimumReleaseAge: null,
      },
    ],
  },
  typeScriptConfig: {
    config: {
      compilerOptions: {
        noEmit: true,
      },
      include: ['src'],
    },
  },
})

project.package?.addField('packageManager', 'pnpm@12.10.1')
project.package?.addField('publishConfig', {
  access: 'public',
  main: 'dist/index.js',
  types: 'dist/index.d.ts',
})

// Published from the root, so `engines` would bind every consumer to the Node.js
// release this repository is developed on. `actions/setup-node` reads the same
// version from `devEngines`, which the registry leaves to the maintainers.
project.package?.file.addDeletionOverride('engines')
project.package?.addField('devEngines', {
  runtime: {
    name: 'node',
    version: `>= ${project.package.minNodeVersion}`,
  },
})

project.package?.setScript(
  'prepublishOnly',
  'rm -rf dist; tsc --project tsconfig.build.json',
)

new TypeScriptConfig(project, {
  fileName: 'tsconfig.build.json',
  config: {
    extends: '@langri-sha/tsconfig/build',
    include: ['src'],
    exclude: ['**/*.test.*'],
  },
})

project.synth()
