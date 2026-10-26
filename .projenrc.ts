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
    minNodeVersion: '24.22.1',
    peerDependencyOptions: {
      pinnedDevDependency: false,
    },
    repository: 'git+https://github.com/langri-sha/vitest.git',
    type: 'module',

    deps: ['nock@15.0.5', 'tempy@3.2.0'],
    devDeps: [
      '@langri-sha/eslint-config@0.10.0',
      '@langri-sha/lint-staged@0.9.11',
      '@langri-sha/prettier@0.4.11',
      '@langri-sha/projen-project@*',
      '@langri-sha/tsconfig@1.1.1',
      'vitest@5.0.5',
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
        'dagger.lock',
        'dagger.toml',
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
  claude: {
    settings: {
      attribution: { commit: '', pr: '', sessionUrl: false },
    },
  },
  codeowners: {
    '*': '@langri-sha',
  },
  dagger: {},
  editorConfig: {},
  eslint: {},
  githubTemplates: {},
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
      '/dagger.lock',
      '/dagger.toml',
    ],
  },
  pnpmWorkspace: {
    minimumReleaseAgeExclude: ['@langri-sha/*', ...Project.presetPackages],
  },
  prettier: {},
  readme: {
    filename: 'readme.md',
  },
  renovate: {
    extends: ['github>langri-sha/renovate-config'],
  },
  typeScriptConfig: {
    config: {
      compilerOptions: {
        noEmit: true,
      },
      include: ['src'],
    },
  },
  worktrunk: {},
})

project.package?.addField('packageManager', 'pnpm@12.15.0')
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
