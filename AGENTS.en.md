# React Native / Expo Shared Code-Generation Rules (Index)

This package is the shared rules entry point for React Native / Expo mobile projects. It defines only directory conventions, code boundaries, Figma workflow, and quality standards that can be reused across Apps. Concrete design values, business rules, and project dependencies must be supplied by the consuming repository's project-specific documentation.

## Required reading order

Before generating or modifying React Native / Expo code, read these files in full:

1. [docs/en/01-core-principles.md](docs/en/01-core-principles.md)
2. [docs/en/02-project-structure.md](docs/en/02-project-structure.md)
3. [docs/en/03-routing-and-navigation.md](docs/en/03-routing-and-navigation.md)
4. [docs/en/04-component-and-styling.md](docs/en/04-component-and-styling.md)
5. [docs/en/05-figma-workflow.md](docs/en/05-figma-workflow.md)
6. [docs/en/06-interaction-platform-and-accessibility.md](docs/en/06-interaction-platform-and-accessibility.md)
7. [docs/en/07-delivery-and-constraints.md](docs/en/07-delivery-and-constraints.md)
8. [docs/en/08-performance-and-rendering.md](docs/en/08-performance-and-rendering.md)
9. [docs/en/09-testing-strategy.md](docs/en/09-testing-strategy.md)
10. [docs/en/10-security-and-privacy.md](docs/en/10-security-and-privacy.md)
11. The consuming project's `mobile/docs/agents/app-specific.md` or equivalent project-specific rules

Read every file by default; do not substitute historical summaries for the source text. If a task has no Figma scope, the Figma-node reading steps in `05-figma-workflow.md` do not apply, but its asset, structure, and quality rules remain applicable.

## Rule boundaries

- The shared rules define standard directories, file responsibilities, layering, interaction quality, performance diagnostics, testing, security and privacy, and delivery workflow.
- Project-specific rules define route names, Tokens, fonts, motion, assets, dependencies, APIs, Auth, storage, and business constraints.
- Figma is the visual source of truth for the current design task; these rules remain the source of truth for code organization and engineering constraints.
- Do not promote the page names, business components, brand colors, or incidental technical decisions of an existing App into shared requirements.
- When project-specific facts are missing, choose the most conservative implementation. Do not invent Design Tokens, motion systems, dependencies, or business logic.

## Consumer integration

Every consuming repository must keep a discoverable in-repository `AGENTS.md` entry point. That entry must declare `rules_language: en` and explicitly point to this file and to the project-specific supplement. Installing the npm package alone does not make tools discover rules inside `node_modules`.

Start the project supplement from [templates/en/app-specific.md](templates/en/app-specific.md).

## Maintenance

- Maintain shared principles only in this repository so copied versions do not evolve independently across Apps.
- A consuming App maintains only its differences and does not duplicate the complete shared ruleset.
- Before adding a new shared rule, confirm that it applies to at least two Apps or is inherently a platform-level quality requirement.
- Concrete component implementations, Token values, and motion parameters must not enter this repository.
