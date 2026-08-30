# 07 Delivery and Constraints

> This document defines dependency constraints, change scope, checks, tests, native acceptance, and final delivery requirements.

## Dependency constraints

- Do not add a third-party dependency without explicit approval.
- When a dependency is needed, submit the selection rationale before installation.
- Each workspace imports only packages declared in its own `package.json`.
- Do not rely directly on a package merely because it exists in the root or another workspace's hoisted `node_modules`.
- Avoid duplicate or conflicting versions of React, React Native, Expo, and native modules.
- UI packages, config plugins, and native modules follow the current Expo workflow; do not independently switch among managed / prebuild / bare strategies.

A dependency proposal includes at least:

- Compatibility with current Expo / React Native
- iOS / Android support
- Whether native code or a config plugin is included
- Performance and bundle-size impact
- Maintenance activity and upgrade risk
- Whether existing dependencies or native APIs already satisfy the need
- Installation, configuration, EAS, and rollback cost

Without approval, provide a recommendation only; do not install it.

## Project boundaries

- `mobile/` is the mobile source boundary and must not directly import backend Node-only internal files.
- Cross-workspace sharing uses public package exports.
- Do not change monorepo workspace boundaries for one screen.
- Do not independently change build, EAS, native project, or signing configuration.
- Do not commit `.expo`, build outputs, temporary exported assets, or local credentials.
- Do not write tokens, passwords, keys, personal data, or environment-variable values into code, logs, or documentation.

## Change scope

- Preserve unrelated existing changes in the repository.
- Do not run destructive Git operations to clean another person's work.
- Do not format unrelated files broadly for a local task.
- When the same root cause affects several screens in one flow, fix them within an explicit boundary and list that scope at delivery.
- If completion requires changing an API, data structure, dependency, or project architecture, obtain approval before implementation.

## Code-generation workflow

### 1. Read and analyze

- Read shared rules, project-specific rules, and relevant existing code.
- Inspect package, path alias, test, and build configuration.
- For a Figma task, complete the node-inspection workflow.
- Inspect existing working-tree changes to avoid overwriting them.

### 2. Map directories

Before editing, identify:

- Files to create and modify
- Responsibility of each file
- Why each item belongs in feature / shared / route
- Components, Hooks, Tokens, and assets to reuse
- Unknowns and assumptions

### 3. Implement

- Complete the requirement with the smallest necessary change.
- Follow existing formatting, types, tests, and comment style.
- Do not add unapproved dependencies or business expansion.
- Give assets semantic names and wire them in during the same task.

### 4. Verify

Run existing project commands appropriate to risk:

- formatter / format check
- lint
- TypeScript typecheck
- unit / integration tests
- Expo config or bundle checks
- iOS / Android native run checks

Concrete commands must be recorded in project-specific rules; do not assume every project uses the same tools.

If existing failures are present, distinguish:

- Problems introduced by the current change
- Pre-existing problems unrelated to the change

Do not use “the project was already failing” to hide a new regression.

## Test requirements

Match test depth to change risk:

- Pure styling: lint, typecheck, and native visual acceptance on the target screen
- Interactive component: state, callbacks, disabled, accessibility, and platform branches
- Hook: derived state, races, cleanup, success, and failure branches
- Navigation: entry, back, replace, modal close, and system back
- API: request contract, loading, errors, Auth invalidation, and concurrency
- Shared component change: inspect every direct consumer

Do not verify only the happy path. A bug fix should add a regression test that covers the root cause whenever possible.

## Figma delivery requirements

After a Figma screen task, state:

- Completed nodes and states
- Reused or new components
- New local assets
- Deviations from Figma and their reasons
- iOS / Android verification
- Whether sibling screens in the same flow were inspected

When the official Figma node was unavailable, label the implementation as a screenshot- or description-based fallback and identify what still requires official alignment.

## Definition of done

A task is complete only when:

- Files are in the correct directories
- Route and navigation hierarchy are correct
- Component responsibilities and state ownership are clear
- No unapproved dependency was added
- No duplicate Token or business source of truth was scattered
- Key interactions actually work
- iOS / Android risks are handled or explicitly documented
- Accessibility and test entry points cover key controls
- Relevant checks pass, or pre-existing failures are isolated and documented
- The final response lists key files, verification results, and remaining deviations

## Prohibited

Do not:

- Generate code without reading project rules
- Put a complete screen implementation in an `app/` route entry
- Hide a tab bar with styling or conditional-unmount hacks
- Put screen business logic into Shared UI
- Copy another App's Tokens, fonts, or motion as defaults
- Replace official Figma assets with approximate online icons
- Draw device system UI manually
- Treat a Web screenshot as final native acceptance
- Cover only one platform without stating the scope
- Add a dependency to avoid a solution already possible with the project
- Create unconfirmed real APIs, storage, permissions, analytics, or business flows
- Refuse appropriate splitting when complexity clearly increases
