# Changelog

[简体中文](CHANGELOG.zh-CN.md) · [日本語](CHANGELOG.ja.md) · **English**

## Unreleased

- Updated the Chinese, English, and Japanese instruction files to match the root `AGENTS.md`, preserving the full execution order and task-specific reading requirements.
- Rebuilt chapters `00`–`12` in all three languages from source revision `v2.0 (2026-09-04)`. All six core sections and all thirteen sections of the full standards are retained, with source section 13 included in `12`.
- Fixed broken paths and references that assumed a single document. Retained both source documents for comparison during maintenance and recorded all structural adjustments.
- Aligned the project templates with the 22 items in section 11 and updated the READMEs. Language selection is now required; the previous English fallback no longer applies.
- Added dependency-free `docs:check` validation for source documents, split chapters, structure across languages, code examples, templates, and links. No package publication or version change is included.

## 0.1.0

- Set the package name to `@linhaobo0221/react-native-code-rules` to match the repository owner.
- Documented installation from an immutable GitHub tag archive and the package name for a future public npm release.
- Retained `private: true` pending explicit confirmation of npm account ownership and the publication workflow.
- Established the entry point and required reading order for the shared React Native / Expo rules.
- Defined the standard `mobile/` directory structure, responsibility boundaries, and routing principles.
- Defined component, styling, Figma, cross-platform interaction, accessibility, and delivery rules.
- Defined performance rules for React rendering, virtualized lists, images, asynchronous work, and profiling.
- Defined the strategy for unit, hook, component, integration, race-condition, and native tests.
- Defined rules for data classification, secure storage, token-based authentication, networking, permissions, and privacy.
- Added project-specific `app-specific.md` templates.
- Added complete Simplified Chinese (`zh-CN`), Japanese (`ja`), and English (`en`) rulesets and project templates.
- Added explicit language selection through `rules_language`, with an English fallback, to avoid inferring the rules language from the device locale or source code.
- Adopted the MIT License with `LinHaobo0221` as the copyright holder.
- Kept the package limited to documentation, with no UI, token, motion, or business logic implementations.
