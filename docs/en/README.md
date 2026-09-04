# React Native / Expo engineering standards: chapter index

> This directory contains the complete English engineering standards for React Native / Expo. The chapters cover directory structure, code layers, routing, components, Figma-to-code workflows, cross-platform interaction, performance, testing, security, and delivery.
>
> These standards apply to React Native / Expo apps; they do not define a particular app's business implementation. Each project's own `app-specific.md` defines its tokens, brand assets, business rules, APIs, dependencies, and Figma files.

> **Revision: v2.0 (2026-09-04)**
>
> This revision strengthens two areas: deciding when to share UI and behavior, and making control flow explicit from user actions to business side effects. It adds hard rules to search before creating, abstract code that changes for the same reasons, reuse at the lowest stable layer, keep one orchestration point per action, remove pass-through wrappers, and choose patterns based on actual complexity.

## How the documents fit together and where to start

- Start with [AGENTS.en.md](../../AGENTS.en.md), the English equivalent of the Chinese rules in the repository-root [AGENTS.md](../../AGENTS.md).
- For every task, first read [00 Core execution rules](00-core-rules.md) in full. Then follow the AGENTS instructions to read the required engineering standards chapters, including those relevant to the task.
- Chapters `01`–`12` together form the complete, authoritative engineering standards, not a summary. This index is not a substitute for reading them. They replace the previous files with the same names; do not also read the historical versions.
- You must read all of `01`–`12` in full for cross-feature refactoring, architectural changes or new subsystems, shared infrastructure changes, authentication / session changes, security-sensitive changes, or changes affecting three or more production modules at once.
- Review reports, version diffs, and old indexes are for maintenance and historical reference only; they are not rule sources for everyday code generation.
- For ordinary app tasks, read only the language version declared by the project. Do not infer the language from the device locale, code text, or a single message. Resolve links relative to the current document's directory.

## Chapters and their source sections

| Chapter | Original content retained in full | When to read |
| --- | --- | --- |
| [00 Core execution rules](00-core-rules.md) | Core rules sections 1–6 | Read in full for every task |
| [01 Core principles](01-core-principles.md) | Engineering standards section 1 | Every code task |
| [02 Project and directory structure](02-project-structure.md) | Engineering standards section 2 | Every code task |
| [03 Routing and navigation](03-routing-and-navigation.md) | Engineering standards section 3 | Routes, navigation, Tabs, Stacks, back behavior, route-level modals |
| [04 Page, UI, reuse, Controllers, and styling](04-component-and-styling.md) | Engineering standards section 4 | Every code task |
| [05 Figma workflow](05-figma-workflow.md) | Engineering standards section 5 | Figma, new UI, visuals, assets, forms, keyboards, overlays, safe areas, accessibility, platform differences |
| [06 Interaction, platforms, and accessibility](06-interaction-platform-and-accessibility.md) | Engineering standards section 6 | Same as 05; read both as required by the AGENTS instructions |
| [07 Dependencies, changes, and delivery](07-delivery-and-constraints.md) | Engineering standards section 7 | Every code task |
| [08 Performance and rendering](08-performance-and-rendering.md) | Engineering standards section 8 | Lists, rendering, image performance, animation, caches, startup, memory, performance optimization |
| [09 Testing strategy](09-testing-strategy.md) | Engineering standards section 9 | Every code task |
| [10 Security and privacy](10-security-and-privacy.md) | Engineering standards section 10 | Authentication, tokens, API security, storage, uploads/downloads, permissions, deep links, WebViews, privacy, sensitive data |
| [11 Project-level rules](11-project-specific-rules.md) | Engineering standards section 11 | Missing project facts, initializing a new project area, auditing project standards |
| [12 Final checklist and summary](12-final-checklist.md) | Engineering standards sections 12 and 13 | Every code task; reread section 12 before delivery |

Use the [app-specific.md template](../../templates/en/app-specific.md) to document the project-specific rules. Fill in all 22 items from section 11 with verified facts about the current project.

## Preserved sources and structural changes

The chapters were split from the two latest source documents in the repository. The original Chinese files remain unchanged for maintenance reference; they are not an additional set of rules to read during coding tasks:

- [react-native-codex-execution-rules.md](../react-native-codex-execution-rules.md)
- [react-native-engineering-standards.md](../react-native-engineering-standards.md)

The original `AGENTS.md` referenced `react-native-expo-core-rules.md` and `react-native-expo-engineering-standards.md`, names that did not correspond to files in the repository. These references now point to `00-core-rules.md` and this chapter index, respectively. The original section 1.4 path `docs/codex/react-native-codex-execution-rules.md` likewise maps to the current language's `00-core-rules.md`.

The only changes to the Chinese rules are the chapter split, each file's opening heading level, and the path updates listed above. In section 1.4, “this file” originally referred to the complete single document; those references now point to the full set of chapters or these shared standards. No clauses, lists, tables, examples, or checklist items have been added, removed, or rewritten. This index replaces the original introduction describing the single document and the ten historical chapters. Section 13 is retained in full in `12`. The English and Japanese versions translate each item and preserve the same structure.

The wording on rule priority in the original section 1.3 is unchanged. When applying the rules, resolve conflicts using the priority in section 1 of the current `AGENTS` instructions; splitting the documents does not change the rules.

For maintenance checks, run `npm run docs:check` (source coverage, structure across all three languages, code examples, and relative links) and `npm run pack:check` (package contents). Automated structure checks do not replace a review of translation meaning.
