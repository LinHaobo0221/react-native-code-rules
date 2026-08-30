# React Native / Expo Shared Code Rules — Language Router

This package provides the same normative rules in Simplified Chinese, Japanese, and English.

## Language selection

The consuming repository must explicitly declare one `rules_language` in its own discoverable `AGENTS.md`:

- `zh-CN` → read [AGENTS.zh-CN.md](AGENTS.zh-CN.md)
- `ja` → read [AGENTS.ja.md](AGENTS.ja.md)
- `en` → read [AGENTS.en.md](AGENTS.en.md)

Do not infer the rules language from device locale, source-code text, or a single user message. If the consuming repository does not declare a supported value, use `en` and report that fallback.

Before generating or modifying React Native / Expo code:

1. Read the consuming repository's own `AGENTS.md`.
2. Resolve its explicit `rules_language`.
3. Read the matching localized index above in full.
4. Read the consuming App's project-specific rules.

Read only one localized ruleset for a normal App task. The three variants carry the same requirements; mixing them adds no authority.

## Package maintenance

When changing this package itself:

- Read all three localized indexes.
- Keep the numbered document names, headings, rule meaning, links, and templates in parity.
- Update all three languages in the same change whenever a normative rule changes.
- Update release notes in all three supported languages.
- Treat English as the conflict-resolution source only when a translation is ambiguous; fix the mismatch in the same release.
- Do not add App-specific UI implementations, Design Tokens, motion values, brand assets, dependencies, or business logic.
