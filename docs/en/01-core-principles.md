# 1. Purpose and scope of the rules

### 1.1 What the shared standards cover

These shared standards establish consistent engineering requirements across apps for:

- The standard `mobile/` directory structure
- Responsibility boundaries between Page, UI, Hook, Data, API, and Shared
- Expo Router route organization
- Figma node inspection, design analysis, asset export, and visual acceptance checks
- iOS / Android interaction, keyboards, modals, safe areas, and accessibility
- Performance diagnosis, rendering boundaries, lists, images, and resource lifecycles
- Testing at each layer, testing async race conditions, and native acceptance checks
- Minimum quality requirements for secure storage, authentication, networking, permissions, and privacy
- Dependencies, checks, change scope, and delivery workflows

### 1.2 What each project must define

Each app must define its own:

- Design tokens for colors, typography, spacing, corner radii, shadows, and other values
- Motion durations, easing, and transition parameters
- Brand components, images, SVGs, and font assets
- Route groups, route paths, tab names, and specific page paths
- API contracts and approaches to authentication, local storage, and business state
- Expo / React Native versions and permitted third-party dependencies
- Target devices, specific performance budgets, and profiling tools
- A test runner, component / E2E testing tools, and CI requirements
- Data classification, permissions, third-party SDKs, and security risk levels
- Its own Figma library, design files, and page links

### 1.3 Rule priority

When rules conflict, the priority is:

1. The user's current explicit requirements and constraints
2. More specific `AGENTS.md` and `app-specific.md` in the consuming repository
3. These shared standards
4. Conservative engineering judgment for cases not covered

Project rules may override design values, dependency choices, and settings explicitly left to each project. They must not lower the minimum requirements for accessibility, cross-platform compatibility, type safety, or maintainability without explanation. If an exception is necessary, record the reason, affected areas, alternative approach, and acceptance criteria.

### 1.4 Language and reading requirements

The repository using these rules must include the following declaration in an `AGENTS.md` that can be discovered:

```md
rules_language: en
```

Do not infer the rules language from the device locale, code text, or a single user message.

Before generating or modifying React Native / Expo code, read:

1. The current task's explicit requirements and constraints
2. The consuming project's `AGENTS.md` files at the root and in `mobile/`
3. [00-core-rules.md](00-core-rules.md), in full for every task
4. The mandatory and task-related sections of these standards specified by the root `AGENTS.md`
5. Project-level `mobile/docs/agents/app-specific.md` or equivalent documentation, if present
6. Directly relevant directories, `package.json`, configuration, existing components, public exports, and tests
7. Figma nodes, screenshots, variables, and assets when the task involves design

Do not limit your review of existing code to the target file. Before adding UI, hooks, utilities, or business flows, also inspect:

- Neighboring implementations in the current feature
- `shared/ui`, `shared/hooks`, `shared/utils`, and public APIs
- Existing design tokens, base components, and implementations that serve the same user intent
- All direct consumers of the target component or flow

If these standards conflict with more specific project rules, follow the project rules as long as they do not lower the minimum engineering quality requirements. Document the exception in the final response. If a task does not involve Figma at all, you may skip Figma node inspection; the rules for component responsibilities, reuse review, control flow, cross-platform quality, and security still apply.

### 1.5 Task scope and conservative implementation

Design implementation tasks:

- Use Figma and project tokens as the visual sources of truth.
- Implement only the pages, states, and interactions required by the task.
- Do not connect static pages or prototypes to real APIs, authentication, or persistence without authorization.

Feature implementation tasks:

- First identify data sources, state ownership, error handling, and navigation boundaries.
- Do not put business state in presentation components.
- Do not introduce API contracts, databases, or storage solutions without confirmation.

Bug-fix or refactoring tasks:

- First identify the root cause and affected areas.
- Preserve unrelated behavior; do not use the task as an opportunity to rewrite the entire feature.
- When the same flow, a shared shell, or a shared component is affected, inspect all direct consumers.

Diagnostic or review tasks:

- By default, limit the work to inspection, verification, and explaining your findings.
- Do not implement fixes or create new architecture unless explicitly requested.

When information is incomplete:

- First inspect the project's existing implementations and project-level documentation.
- Reuse established, stable patterns.
- Choose the smallest reversible implementation.
- Do not add dependencies, invent business behavior, or create tokens or a motion system on your own.
- Explain assumptions and deviations in the final response.

If different choices would significantly change product behavior, data structures, dependencies, or project boundaries, request confirmation first.

### 1.6 Six hard rules that must not be weakened

1. **Search before creating**: Before adding a component, hook, utility, or flow, search existing implementations and record the reuse decision.
2. **Abstract code that changes for the same reasons**: Only share code when its semantics, state contracts, and expected reasons for future changes match; visual similarity alone does not justify sharing.
3. **Reuse at the lowest stable layer**: Prefer reusing tokens, primitives, behavior hooks, or pure rules instead of creating a one-size-fits-all component for every page.
4. **Feature First**: Keep uncertain abstractions within the feature; move them to `shared` only after their contracts stabilize, they serve multiple features, and they are not tied to a particular business domain.
5. **One action, one orchestration point**: Each major user action must have a single point of orchestration, where its key steps can be read in sequence.
6. **No pass-through wrappers**: Remove wrapper functions unless they add semantics, a boundary, transformation, validation, error mapping, concurrency control, or the ability to swap implementations; use design patterns only to address actual complexity.

---
