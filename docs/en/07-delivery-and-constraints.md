# 7. Rules for dependencies, change scope, and delivery

### 7.1 Dependency constraints

- Do not add third-party dependencies without explicit approval.
- If a new dependency is needed, explain why you chose it before installing it.
- Each workspace may import only packages declared in its own `package.json`.
- Do not depend on packages hoisted from the root or other workspaces.
- Avoid duplicate or conflicting versions of React, React Native, Expo, and native modules.
- UI packages, config plugins, and native modules must follow the current Expo workflow.
- Do not switch between managed / prebuild / bare without authorization.
- Do not add a DI container, state machine library, Repository framework, or UI library just to use a design pattern. Avoid new dependencies when the language and existing project tools are sufficient.

The explanation for choosing a dependency must cover at least:

- Expo / React Native compatibility
- iOS / Android support
- Whether it contains native code or a config plugin
- Performance and bundle-size impact
- Maintenance activity and upgrade risks
- Whether existing dependencies or native implementations can meet the need
- Installation, configuration, EAS, and rollback costs

Without approval, you may recommend a dependency but must not install it.

### 7.2 Project boundaries

- Treat `mobile/` as the source of truth for the mobile app; do not directly import Node-only internal backend files.
- Cross-workspace sharing must use public package exports.
- Do not change monorepo workspace boundaries for a single page.
- Do not change build, EAS, native-project, or signing configuration without authorization.
- Do not commit `.expo`, build outputs, temporary exported assets, or local credentials.
- Do not put tokens, passwords, keys, personal information, or environment-variable values in code, logs, or documentation.
- Do not bypass feature boundaries through a global EventBus, module singleton, or implicit barrel export.

### 7.3 Change scope

- Preserve existing changes unrelated to the task.
- Do not use destructive Git operations to discard someone else's work.
- Do not reformat unrelated files for a narrowly scoped change.
- When one root cause affects multiple consumers of a flow, shared component, or shared Use Case, review those consumers together within a clearly defined scope and list what that scope includes.
- Shared-code migrations must remove the duplicate implementations they replace or document a phased migration plan and the conditions for ending the transition.
- Obtain confirmation before changing APIs, data structures, dependencies, or project architecture.

### 7.4 Code generation workflow

1. Read shared standards, project rules, and relevant existing code.
2. Inspect packages, path aliases, tests, build configuration, and existing workspace changes.
3. Search for reusable code before adding UI, hooks, utilities, or business operations; list candidates and explain why you will or will not use them.
4. Trace the call path for each major user action and choose a direct handler, Controller, Use Case, Reducer, Strategy, Adapter, or Repository; explain the need for each pattern.
5. For Figma tasks, complete the full node-inspection workflow and map Figma components/variants to existing or new code abstractions.
6. Before implementation, explain where code will go, each file's responsibility, the reuse review, action flows, uncertainties, and assumptions.
7. Meet the requirements with the smallest necessary changes; keep a single point of orchestration for each action.
8. When extracting shared code, update all target consumers and remove the old duplicate versions; do not leave two sources of truth without explanation.
9. Remove pass-through functions that add no meaning, handlers that are just aliases, and dead code created by this change.
10. Give assets descriptive names and update their references within the same task.
11. Run the project's existing format, lint, typecheck, test, Expo config, bundle, and native checks.
12. Review the actual call chains for major actions, all direct consumers of shared components, and iOS / Android behavior.
13. Distinguish newly introduced problems from existing repository problems; do not hide regressions behind pre-existing errors.

Example pre-implementation output:

```text
Reuse review: reuse shared/ui/Button; extract feature/ui/ProfileField;
              do not merge HomeCard and ProfileCard because their state contracts
              and expected future changes differ.
Action path: ProfileEditorView.onSubmit
             -> useProfileEditorController.actions.submit
             -> updateProfile use case
             -> profileApi.update
             -> typed result
             -> reducer + navigation
Pattern rationale: validation, a submission lock, an API call, cache replacement, and error mapping
                   justify a Use Case; mutually exclusive states justify a Reducer;
                   there are no multiple data sources, so no Repository is needed.
```

### 7.5 Match testing effort to risk

- Pure styling changes: lint, typecheck, and native visual checks for the target page.
- Feature UI: tests for state, callbacks, disabled behavior, accessibility, variants, and platform branches.
- Shared UI: test public contracts and inspect all direct consumers; testing only the component itself is insufficient.
- Hook / Controller: page-state mapping, race conditions, cleanup, user actions, and navigation/feedback outcomes.
- Use Case: pure unit tests for step order, success, failure, idempotency, error mapping, and boundaries around calls to dependencies.
- Reducer / Model: valid transitions, illegal combinations, selectors, and invariants.
- Strategy / Adapter / Repository: consistent contracts, switching implementations, and mapping external errors.
- Navigation: entry points, back, replace, modal dismissal, and system back.
- API: request contracts, runtime validation, loading, errors, expired or invalid authentication, and concurrent behavior.

Do not test only the happy path. For bug fixes, prioritize regression tests that cover the root cause. Tests should verify public behavior and invariants, not internal call chains that have no behavioral significance.

### 7.6 Figma delivery requirements

After completing a Figma page, explain:

- Completed nodes and states
- Reused tokens, primitives, patterns, and feature components
- Why new components could not reuse existing implementations
- New local assets
- Deviations from Figma and their reasons
- iOS / Android verification status
- Whether sibling pages in the same flow and shared-component consumers were checked

If the source Figma nodes are inaccessible, use screenshots or descriptions as the fallback and clearly identify what still needs to be checked against the source design.

### 7.7 Definition of done

Work is complete only when all of the following hold:

- Files are in the correct directories with clear dependency direction.
- Routes and navigation hierarchy are correct.
- Reuse searches are complete; new abstractions have clear semantics, consumers, and reasons to change.
- Shared functionality sits at the lowest stable layer; code is not shared merely for the sake of reuse.
- Replaced duplicate implementations have been deleted, or migration exceptions recorded.
- Component responsibilities, state ownership, and main action paths are clear.
- Each complex user action has a single point of orchestration, with no chains of pass-through wrappers.
- Each design pattern addresses actual complexity that can be explained; no architecture is added for its own sake.
- No unapproved dependencies were added.
- No new duplicate tokens, business rules, or sources of truth for business data are scattered throughout the code.
- Key interactions genuinely work.
- iOS / Android risks have been handled or explicitly explained.
- Accessibility and test entry points cover key controls.
- Relevant checks pass, or pre-existing failures have been isolated and explained.
- The final response lists key files, reuse decisions, action flows, verification results, and remaining deviations.

### 7.8 Prohibited practices

Prohibited:

- Generating code without reading project rules and searching existing code
- Placing complete page implementations in `app/` route entry points
- Adding similar Buttons, Cards, Rows, Modals, Inputs, or EmptyStates without evaluating existing components
- Merging business components only because they look similar or occur twice
- Creating one-size-fits-all components for multiple pages with excessive booleans, route checks, render overrides, and style escape hatches
- Putting page business logic in shared UI
- Using chains of pass-through aliases that forward the same arguments, such as `handleX -> doX -> executeX -> service.x`
- Creating `helpers`, `common`, `manager`, `service`, or Facades without clear responsibilities
- Wrapping a single API call in a Use Case, Repository, Factory, class, or interface just to demonstrate a design pattern
- Using an EventBus, Context, or module singleton to hide control flow that can be expressed directly
- Executing requests, navigation, storage, or other side effects inside Reducers
- Controlling toasts, dialogs, component state, or Expo Router inside Use Cases
- Copying another app's tokens, fonts, or motion as defaults
- Replacing source Figma assets with look-alike icons found online
- Hand-drawing device system UI
- Treating web screenshots as final native acceptance evidence
- Handling only one platform without explaining the scope
- Adding dependencies for problems the project can already solve with its existing tools
- Creating unconfirmed real APIs, storage, permissions, analytics, or business flows
- Refusing to split code when growing complexity warrants it, or forcing architectural layers onto simple cases

---
