# Repository-wide instructions for Codex

rules_language: en

Resolve documentation links relative to this file's directory. If this file is in an installed package, resolve links from its location in that package, not from the consuming project's working directory.

## 1. Scope and rule priority

This file lives at the repository root and applies to the entire repository. An `AGENTS.md` or `AGENTS.override.md` closer to the target code supplements or overrides these instructions only within that file's directory scope.

Resolve rule conflicts in this order:

1. Requirements, constraints, and acceptance criteria explicitly stated in the user's current task.
2. The closest applicable `AGENTS.override.md` / `AGENTS.md` to the target file.
3. Verifiable project facts in the current repository, including code, configuration, API contracts, tests, and approved architecture documents.
4. The full engineering standards listed by chapter in [docs/en/README.md](docs/en/README.md).

[docs/en/00-core-rules.md](docs/en/00-core-rules.md) defines the mandatory requirements to meet before every coding task and summarizes how to apply the full standards. It does not reduce or relax them.

## 2. Required React Native / Expo rule documents

For React Native / Expo code tasks, Codex must use both sets of shared rule documents:

1. [docs/en/00-core-rules.md](docs/en/00-core-rules.md)
   - Concise execution rules.
   - Read them in full every time you generate, modify, fix, or refactor React Native / Expo code.

2. The full engineering standards listed by chapter in [docs/en/README.md](docs/en/README.md)
   - Complete and authoritative engineering standards.
   - Follow the reading requirements in this file. For architectural, cross-feature, or high-risk tasks, read every chapter from `01` through `12` in full (`12` also retains the original section 13 summary). Reading the index is not a substitute for reading the chapters.

Do not rely on past conversations, previous readings, summaries, or memory instead of reading the documents for the current task. If the core rules, standards index, or any required chapter is missing or unreadable, report the missing path before modifying React Native / Expo code.

## 3. Required steps before changing code

Follow this order. Do not start writing code or modifying files until steps 1–7 are complete.

### Step 1: Understand the current task

- Identify the goal, constraints, platforms involved, and completion criteria.
- Classify the task: feature implementation, bug fix, refactoring, code review, Figma implementation, or architectural design.
- Distinguish explicit user requirements from model assumptions; do not treat assumptions as project facts.

### Step 2: Load repository rules

- Apply this root-level file.
- Check the target file's path for closer `AGENTS.md` or `AGENTS.override.md` files.
- Resolve conflicts using the priority in section 1.

### Step 3: Read the core rules in full

Read in full:

[docs/en/00-core-rules.md](docs/en/00-core-rules.md)

Follow all six hard rules and the completion checklist as requirements for this task.

### Step 4: Verify project facts before choosing an architecture

Inspect at least:

- `git status`, preserving changes unrelated to the current task.
- Relevant workspaces' `package.json` files and available scripts.
- Expo configuration, `tsconfig`, path aliases, lint, formatting, and test configuration.
- Architecture documents, API contracts, and project conventions directly related to the task.
- The project's actual approaches to state management, network requests, storage, routing, UI, and testing.

Do not invent dependencies, routes, design tokens, API contracts, state libraries, storage mechanisms, or platform behavior without evidence in the repository.

### Step 5: Inspect existing code before adding new code

Read and search:

- The target feature's Pages, UI, hooks, Models, Use Cases, APIs, types, and utilities.
- Direct callers, direct consumers, and related tests of the target code.
- Similar implementations already in the current feature.
- `shared/ui`, `shared/hooks`, `shared/utils`, `shared/constants`, and public exports.
- Existing design tokens, base components, and implementations that serve the same user intent.

Before changing a shared component, hook, or flow, inspect all direct consumers, not just the current page.

### Step 6: Read the engineering standards for the task type

Index: [docs/en/README.md](docs/en/README.md). Chapter numbers correspond to the original sections of the complete standards; chapter `12` also includes the original section 13 summary.

For every code task, you must read:

- Section 1: [Purpose and scope](docs/en/01-core-principles.md)
- Section 2: [Project and directory structure](docs/en/02-project-structure.md)
- Section 4: [Page, UI, reuse, Controllers, and styling](docs/en/04-component-and-styling.md)
- Section 7: [Dependencies, change scope, and delivery](docs/en/07-delivery-and-constraints.md)
- Section 9: [Testing strategy](docs/en/09-testing-strategy.md)
- Section 12: [Final checklist](docs/en/12-final-checklist.md)

Read additional sections according to the task:

- Routes, navigation, Tabs, Stacks, back behavior, or route-level modals: read [section 3](docs/en/03-routing-and-navigation.md).
- Figma, new UI, visual adjustments, images/SVGs, forms, keyboards, sheets, dialogs, safe areas, accessibility, or iOS/Android differences: read [section 5](docs/en/05-figma-workflow.md) and [section 6](docs/en/06-interaction-platform-and-accessibility.md).
- Lists, rendering, image performance, animation, caches, startup, memory, or performance optimization: read [section 8](docs/en/08-performance-and-rendering.md).
- Authentication, tokens, API security, storage, uploads/downloads, permissions, deep links, WebViews, privacy, or sensitive data: read [section 10](docs/en/10-security-and-privacy.md).
- Missing project facts, initializing a new project area, or auditing project standards: read [section 11](docs/en/11-project-specific-rules.md).

For the following tasks, you must read the entire engineering standards—all chapters from `01` through `12`:

- Cross-feature refactoring.
- Architectural changes or adding a subsystem.
- Shared infrastructure changes.
- Authentication / session changes.
- Security-sensitive changes.
- Changes affecting three or more production modules at once.

### Step 7: Pass the pre-implementation quality gate

Before making changes, provide a brief implementation plan covering at least:

1. Target files and each file's responsibility.
2. Reuse candidates and the final choice: reuse directly, extend, extract lower-level functionality, or keep separate.
3. The full path of the main user action, from the UI callback through its single point of orchestration to external side effects.
4. The design patterns you plan to use, the actual complexity they address, and the unnecessary patterns you will explicitly leave out.
5. The validation commands and platform acceptance checks you plan to run after the changes.

If you find no reuse candidates, state where you searched and write “No existing implementation matches the required semantics.” Do not skip the reuse review.

## 4. Required implementation practices

- Make the smallest complete change that meets the requirements; do not rewrite unrelated code.
- Search before creating. Share code only when semantics, state contracts, accessibility/platform contracts, and expected reasons for future changes all match.
- Reuse at the lowest stable layer: token → primitive → pure function/Model → Headless Hook → Feature Pattern → Shared Pattern.
- Keep unstable abstractions within the feature; do not create one-size-fits-all components with page-specific booleans, route checks, oversized configs, or unrestricted style overrides.
- Each major user action must have a single point of orchestration, where the key steps can be read in sequence.
- Remove pass-through chains such as `handleX -> doX -> executeX -> service.x` unless each layer adds transformation, validation, invariants, branching, error mapping, concurrency control, a side-effect boundary, or an interchangeable implementation.
- Use Controllers, Use Cases, Reducers/state machines, Strategies, Adapters, or Repositories only when actual complexity warrants them; do not add layers just to make the code look more architecturally sophisticated.
- UI must not orchestrate APIs, authentication, storage, or navigation; Use Cases must not depend on React, UI, toasts, or routers; Reducers must remain pure functions.
- Do not add production dependencies without explicit user approval.
- When extracting shared code, migrate the target consumers and remove the duplicate implementations it replaces in the same change. If migration must be phased, record the scope, reason, and completion criteria.
- Add or update tests at the appropriate layers according to behavior and regression risk.

## 5. Verification and review after changes

After implementation, follow this order:

1. Format modified files when the project's existing formatter is available.
2. Run relevant lint checks.
3. Run TypeScript typechecking.
4. Run tests for the changed behavior first, then broader relevant suites based on the impact.
5. Run Expo config, bundle, or native build checks appropriate to the affected areas.
6. Verify platform-sensitive changes on both iOS and Android; web rendering cannot replace final native acceptance checks.
7. Review the complete diff for unrelated changes, dead code, leftover duplication, hidden call chains, unsafe type assertions, missing cleanup, and new cross-layer dependencies.
8. Reread [core rules section 6](docs/en/00-core-rules.md) and [engineering standards section 12](docs/en/12-final-checklist.md).
9. Mark every relevant check as passed, failed, not applicable, or not run.
10. For required checks not run, identify the specific checks and reasons; do not describe the work as “fully complete.”

## 6. Required content in the final response

- Changes and key files.
- Reuse and shared-code decisions, with reasons.
- Main action paths and the boundary that owns each action's orchestration.
- Introduced design patterns and why they are necessary.
- Commands and checks actually run, with results.
- Completed iOS / Android verification.
- Remaining risks, deviations, and unverified items.

## 7. Prohibited shortcuts

- Generating code before reading mandatory rules and relevant existing code.
- Adding similar Buttons, Cards, Rows, Inputs, Modals, EmptyStates, hooks, utilities, or business flows without searching for reusable code.
- Forcing abstractions merely because code looks similar or appears twice.
- Using an EventBus, Context, module singleton, generic manager, or wrapper that forwards the same arguments to hide control flow that could be expressed directly.
- Creating `helpers.ts`, `common.ts`, `manager.ts`, or `service.ts` without a clear single responsibility.
- Adding unnecessary Use Cases, Repositories, Factories, classes, or interfaces around a single simple API call just to use a design pattern.
- Adding dependencies for problems the existing stack can already solve clearly.
- Claiming completion after skipping tests, typechecking, cross-platform impact analysis, or diff review.
