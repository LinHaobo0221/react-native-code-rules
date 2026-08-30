# 01 Core Principles

> This document defines the goals, scope, sources of truth, task boundaries, and default decision-making for the shared rules.

## Goals

Maintain consistent engineering structure and code quality across React Native / Expo Apps while allowing each App to implement completely different visuals and features based on its own Figma designs, brand, Tokens, motion, and business requirements.

Generated or modified code must:

- Integrate directly into the current project rather than exist as a standalone Demo or disconnected snippet
- Follow the current project's directories, naming, dependencies, and technical decisions
- Have clear component responsibilities for reading, testing, review, and future change
- Cover iOS and Android by default; Web behavior does not replace native acceptance
- Reproduce Figma faithfully when a task is design-driven instead of independently standardizing or redesigning the visuals
- Avoid expanding business logic, dependencies, persistence, or infrastructure beyond the task scope

## Scope

These rules apply to:

- React Native / Expo screen and component development
- Expo Router organization
- Figma design implementation
- Local UI interaction
- Refactoring and sharing existing screens
- Code boundaries for mobile API integration, state, and data presentation
- iOS / Android platform differences

These rules do not define:

- Concrete UI appearance
- Token values
- Brand colors and fonts
- Motion duration and easing
- Business processes, API contracts, or database schemas
- A fixed list of third-party libraries

The consuming project's `app-specific.md`, existing code, Figma design, or task requirements must supply those facts.

## Sources of truth required before a task

Confirm facts in this order before generating code:

1. Explicit requirements and constraints in the current task
2. The consuming repository's root and `mobile/` `AGENTS.md` files
3. Every document in these shared rules
4. The consuming project's `app-specific.md`
5. Current project directories, `package.json`, configuration, existing components, and tests
6. Figma nodes, screenshots, variables, and assets when design is in scope

Do not infer current-project facts only from an earlier answer, cached summary, or another App's implementation.

## Shared and project-specific boundaries

Shared rules define how code is organized and implemented. Project-specific rules define what the current App uses. For example:

- Shared rules require repeated colors to use Tokens; project rules choose Token names and values.
- Shared rules require consistent transition semantics; project rules choose animation type, duration, and easing.
- Shared rules require centralized route constants; project rules choose route groups and paths.
- Shared rules require correct font mapping; project rules choose loaded fonts and language fallbacks.

When project-specific and shared rules conflict:

- Project rules may override design values, dependency choices, and explicit project-structure extension points.
- Project rules must not silently lower the baseline for accessibility, cross-platform compatibility, type safety, or maintainability.
- An approved exception must record its reason, impact, alternative mitigation, and acceptance criteria.

## Determine the task type

Classify the task before changing files.

### Design implementation

- Use Figma and project Design Tokens as the visual sources of truth.
- Implement only the requested screens, states, and interactions.
- If the user requests only a static screen or prototype, do not add a real API, Auth, or persistence.

### Feature implementation

- Establish the data source, state owner, error behavior, and navigation boundary.
- Do not place business state inside presentational components.
- Do not create API contracts, databases, or local-storage strategies without confirmation.

### Fix or refactor

- Identify the root cause and affected scope first.
- Preserve unrelated behavior; do not use a local request as a reason to rewrite the entire feature.
- If the issue belongs to one flow, shared shell, or shared component, inspect all directly affected screens.

### Diagnosis or review

- Default to read-only investigation, verification, and conclusions.
- Do not implement a fix or create a new architecture unless modification was explicitly requested.

## Conservative implementation

When a rule, design, or requirement is incomplete:

- Inspect the current project's implementation and project-specific documentation
- Reuse stable existing patterns
- Choose the smallest reversible implementation
- Do not add dependencies
- Do not invent unconfirmed business behavior
- State assumptions and deviations in the delivery summary

If the options would materially change product behavior, data structure, dependencies, or project boundaries, request confirmation first.

## Maintainability

- “It runs” is not the definition of done.
- Pages compose; UI components present; Hooks own state and behavior orchestration.
- Evaluate repeated implementations for sharing, but extract only at the smallest appropriate boundary.
- Do not over-abstract for hypothetical requirements that do not yet exist.
- Within task scope, reduce unnecessarily complex files, branches, and duplicate styles.
- Preserve unrelated changes made by the user or other developers.

## Consistency across one flow

When an issue affects a flow or shared shell, such as:

- safe area and StatusBar
- Stack / Tabs hierarchy
- common header and close semantics
- bottom action areas
- keyboard avoidance
- Modal / Sheet motion
- list loading / empty / error states

Inspect every screen that directly reuses that structure. If only part of the flow is changed, state the covered and uncovered scope at delivery.

## Documentation and code language

- Follow the consuming project's rule for explanatory language; otherwise follow the user's current language.
- Preserve original code forms for package names, routes, components, Hooks, types, fields, and error codes.
- Comments explain non-obvious intent, platform differences, and constraints; they do not restate visible code behavior.
