# React Native Code Rules

[简体中文](README.zh-CN.md) · [日本語](README.ja.md) · **English**

Shared code-generation standards for React Native and Expo projects. This repository defines code structure, responsibilities, implementation workflows, and quality requirements. It does not provide UI implementations, design tokens, motion parameters, brand assets, or business logic.

Current version: `0.1.0`

## Scope

These rules apply to mobile projects built with React Native and Expo. They are particularly useful for teams that build screens from Figma designs, organize routes with Expo Router, and want a consistent code structure across apps.

The shared package covers:

- A standard `mobile/` directory structure
- Responsibilities of Page / UI / Controller / Use Case / Model / API / Shared
- Component, file, props, and styling conventions
- General principles for organizing routes with Expo Router
- Figma inspection, node analysis, asset exports, and delivery workflows
- iOS and Android behavior, keyboard handling, modals, safe areas, and accessibility
- Performance, rendering, lists, images, and resource lifecycles
- Testing at each layer, race-condition tests, and native acceptance testing
- Baseline requirements for secure storage, authentication, networking, permissions, and privacy
- Dependency, validation, and delivery constraints

Each app defines its own:

- Design tokens, including colors, fonts, spacing, corner radii, and shadows
- Motion duration, easing, and transition values
- Brand components, images, SVGs, and fonts
- Route groups, paths, and tab names
- API, authentication, local storage, and business-state management strategies
- Performance budgets, target devices, and profiling tools
- Test runners, component and E2E testing tools, and CI requirements
- Data classification, permissions, third-party SDKs, and security risk levels
- Expo / React Native versions and approved dependencies
- Figma libraries and links to files and pages

## Languages

The package ships equivalent rules in:

- Simplified Chinese: `zh-CN`
- Japanese: `ja`
- English: `en`

Each repository using these rules must explicitly set `rules_language` to a supported language and reference the corresponding `AGENTS` file. Do not infer the rules language from the device locale, source code, or a single user message.

## Repository structure

~~~text
react-native-code-rules/
├── AGENTS.md
├── AGENTS.zh-CN.md
├── AGENTS.ja.md
├── AGENTS.en.md
├── README.md
├── README.zh-CN.md
├── README.ja.md
├── CHANGELOG.md
├── CHANGELOG.zh-CN.md
├── CHANGELOG.ja.md
├── docs/
│   ├── zh-CN/
│   ├── ja/
│   └── en/
└── templates/
    ├── zh-CN/
    ├── ja/
    └── en/
~~~

Each `docs/<locale>/` directory contains the same 13 rule documents, numbered `00` through `12`, and a `README.md` index. Its project-specific template is at `templates/<locale>/app-specific.md`.

Start with the `AGENTS` file for your language, then read all of `00`, the mandatory core rules. Follow the AGENTS file's reading instructions for required and task-specific chapters of the engineering standards. For high-risk tasks, read all of `01` through `12`. File `12` also includes the summary from section 13 of the source document. Reading the index does not replace reading the chapters themselves.

Start here for English: [AGENTS.en.md](AGENTS.en.md). See the [engineering standards index](docs/en/README.md) for the chapter mapping and notes on preserving the source documents. The rules revision, `v2.0 (2026-09-04)`, is tracked separately from package version `0.1.0`. This reorganization does not publish the package or automatically update its version.

## Using the rules in your app

Version `0.1.0` remains marked `private` to prevent accidental npm registry publication until npm account ownership and the publication workflow are confirmed. Try it from a local path:

~~~bash
npm install --save-dev ../react-native-code-rules
~~~

Once the corrected `v0.1.0` GitHub release is republished, you can pin that version by installing its immutable tag archive over HTTPS:

~~~bash
npm install --save-dev https://github.com/LinHaobo0221/react-native-code-rules/archive/refs/tags/v0.1.0.tar.gz
~~~

Once the package is published to the public npm registry, install it using the lowercase scoped package name:

~~~bash
npm install --save-dev @linhaobo0221/react-native-code-rules@0.1.0
~~~

Installing the package does not activate the rules automatically. Your repository's `AGENTS.md` or `mobile/AGENTS.md` must explicitly instruct code-generation tools to read the package's rules, starting with the file for the correct language.

English example (read both files in full, in the order shown):

~~~md
# Mobile rules entry

rules_language: en

Before modifying `mobile/`, read these files in full:

1. `node_modules/@linhaobo0221/react-native-code-rules/AGENTS.en.md`
2. `mobile/docs/agents/app-specific.md`
~~~

For Chinese use `rules_language: zh-CN` with `AGENTS.zh-CN.md`. For Japanese use `rules_language: ja` with `AGENTS.ja.md`.

The shared rules define code structure and minimum quality requirements; the project-specific document records your app's design and engineering facts. Copy the matching template to `mobile/docs/agents/app-specific.md` in your project and fill in the project-specific details:

- [Chinese template](templates/zh-CN/app-specific.md)
- [Japanese template](templates/ja/app-specific.md)
- [English template](templates/en/app-specific.md)

## Rule precedence

1. Explicit requirements, constraints, and acceptance criteria in the current user task
2. The nearest applicable `AGENTS.override.md` / `AGENTS.md` on the target file's path
3. Verifiable facts in the current repository, including code, configuration, API contracts, tests, and approved architecture documents
4. The chapters that make up this package's full engineering standards

The core rules must be followed before every coding task. They do not reduce or relax the full standards. Follow the `AGENTS` file for your language for detailed instructions.

Project-specific rules may define tokens, motion, and technology choices, but should not silently lower the shared minimum requirements for maintainability, accessibility, or quality on both platforms. If an exception is necessary, record its reason, scope, and how it will be verified for acceptance.

## Documentation checks

```bash
npm run docs:check
npm run pack:check
```

The first command checks the Chinese chapters against the preserved source documents. It also checks structure and code examples across languages, relative links, and templates. The second previews the package contents without publishing. A human review is still needed to confirm that translations preserve the meaning; structural checks alone cannot establish that.

## License

Released under the [MIT License](LICENSE). Commercial and non-commercial use, modification, redistribution, sublicensing, and sale are permitted as long as the copyright and license notices are retained.

## Versioning

- Patch: wording clarifications and conflict fixes without changing existing structural requirements
- Minor: compatible rules, optional directories, or new implementation checks
- Major: changes to the standard directory structure, responsibility boundaries, required reading order, or other breaking requirements

Each app should pin a specific rules version and review rule changes in a pull request before upgrading. Do not use a floating version that can update without review.
