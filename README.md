# React Native Code Rules

[简体中文](README.zh-CN.md) · [日本語](README.ja.md) · **English**

Versioned, multilingual code-generation standards for React Native and Expo projects. This repository defines structure, responsibilities, implementation workflows, and quality standards. It does not ship UI implementations, Design Tokens, motion values, brand assets, or business logic.

Current version: `0.1.0`

## Scope

These rules apply to mobile projects built with React Native and Expo, especially teams that implement screens from Figma, organize navigation with Expo Router, and want consistent code structure across multiple Apps.

The shared package covers:

- A standard `mobile/` directory structure
- Page / UI / Hook / Data / Shared responsibility boundaries
- Component, file, props, and styling conventions
- General Expo Router organization
- Figma inspection, node analysis, asset export, and delivery workflow
- Cross-platform iOS / Android behavior, keyboard handling, Modal, safe area, and accessibility
- Performance, rendering, lists, images, and resource lifecycle
- Layered testing, race-condition testing, and native acceptance
- Secure storage, Auth, networking, permissions, and privacy baselines
- Dependency, validation, and delivery constraints

Each App defines:

- Design Tokens such as colors, typography, spacing, radius, and shadows
- Motion duration, easing, and transition values
- Brand components, images, SVGs, and fonts
- Route groups, paths, and tab names
- APIs, Auth, local storage, and business-state strategies
- Performance budgets, target devices, and profiling tools
- Test runners, component / E2E tools, and CI gates
- Data classification, permissions, third-party SDKs, and security risk levels
- Expo / React Native versions and approved dependencies
- Figma Library, files, pages, and links

## Languages

The package ships equivalent rules in:

- Simplified Chinese: `zh-CN`
- Japanese: `ja`
- English: `en`

Each consuming repository must explicitly declare `rules_language` and point to one localized `AGENTS` entry. Do not select a language from device locale or infer it from source code. English is the fallback when no supported language is declared.

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

Each locale contains the same ten numbered rule documents and one project-specific template.

## Use in an App

Version `0.1.0` remains marked `private` to prevent accidental npm registry publication until npm account ownership and the publication workflow are confirmed. Try it from a local path:

~~~bash
npm install --save-dev ../react-native-code-rules
~~~

After the corrected `v0.1.0` GitHub release is published, install its immutable HTTPS tag archive:

~~~bash
npm install --save-dev https://github.com/LinHaobo0221/react-native-code-rules/archive/refs/tags/v0.1.0.tar.gz
~~~

After publication to the public npm registry, install the lowercase scoped package:

~~~bash
npm install --save-dev @linhaobo0221/react-native-code-rules@0.1.0
~~~

Installing the package alone does not activate its rules. The consuming repository must reference the correct localized entry in its own `AGENTS.md`.

English example:

~~~md
# Mobile rules entry

rules_language: en

Before modifying `mobile/`, read these files in full:

1. `node_modules/@linhaobo0221/react-native-code-rules/AGENTS.en.md`
2. `mobile/docs/agents/app-specific.md`
~~~

For Chinese use `rules_language: zh-CN` with `AGENTS.zh-CN.md`. For Japanese use `rules_language: ja` with `AGENTS.ja.md`.

Copy the matching template into the consuming project:

- [Chinese template](templates/zh-CN/app-specific.md)
- [Japanese template](templates/ja/app-specific.md)
- [English template](templates/en/app-specific.md)

## Rule precedence

1. Explicit requirements and constraints in the current user task
2. More specific `AGENTS.md` and `app-specific.md` files in the consuming repository
3. This package's shared rules
4. Conservative engineering judgment for anything not covered above

Project-specific rules may choose Tokens, motion, and technologies, but should not silently lower the shared baseline for maintainability, accessibility, or cross-platform quality. Record the reason, scope, and acceptance method for approved exceptions.

## License

Released under the [MIT License](LICENSE). Commercial and non-commercial use, modification, redistribution, sublicensing, and sale are permitted as long as the copyright and license notices are retained.

## Versioning

- Patch: wording clarifications and conflict fixes without changing existing structural requirements
- Minor: compatible rules, optional directories, or new implementation checks
- Major: changes to the standard directory structure, responsibility boundaries, required reading order, or other breaking requirements

Each App should pin a rules version and review upgrades through a Pull Request rather than using an uncontrolled floating version.
