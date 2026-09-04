# React Native / Expo execution rules for Codex

> This file defines the core requirements mandated by the repository-root `AGENTS.md`. Read it in full before every task that generates, modifies, refactors, or reviews React Native / Expo code. For detailed explanations and platform, Figma, performance, testing, and security requirements, see the chapters listed in this directory's [engineering standards index](README.md).

## 1. Six hard rules

1. **Search before creating**: Before adding a component, hook, utility, or flow, search the current feature, `shared`, tokens, public exports, and implementations that serve the same user intent.
2. **Abstract code that changes for the same reasons**: Share code only when its semantics, state contracts, and expected reasons for future changes match; visual similarity is not enough.
3. **Reuse at the lowest stable layer**: Consider tokens, primitives, pure functions, Headless Hooks, feature patterns, and shared patterns in that order; do not jump straight to one-size-fits-all components.
4. **Feature First**: Keep unstable abstractions within the feature; move them into `shared` only when they work across features, are not tied to a particular business domain, and have stable contracts.
5. **One action, one orchestration point**: Each major user action has a single point of orchestration, where its key steps can be read in sequence.
6. **No pass-through wrappers**: Remove wrapper functions unless they add transformation, validation, an invariant, branching, error mapping, concurrency control, a side-effect boundary, or the ability to swap implementations.

## 2. Required output before coding

```text
Target files:
- path: responsibility

Reuse review:
- Candidate components / hooks / tokens:
- Decision: reuse directly / extend / extract lower-level functionality / keep separate
- Reason: semantics, state contracts, reasons to change

Main action path:
UI callback
-> Controller action or direct handler
-> optional Use Case
-> API / storage / cache adapter
-> typed result
-> UI state / navigation / feedback

Pattern selection:
- Which patterns are used and what actual complexity they address
- Explicitly state which patterns are unnecessary
```

If you find no reuse candidates, state: “Searched; no existing implementation matches the required semantics.”

## 3. Deciding whether to share UI

### 3.1 Types of duplication and suitable abstractions

| Duplicated content | Preferred abstraction |
| --- | --- |
| Colors, spacing, corner radii, typography, motion | Design token |
| Same UI structure and same interaction semantics | Feature UI; shared UI once stable |
| Same behavior, different UI | Headless Hook / pure state model |
| Same validation, transformation, or selector | `model/` or pure `utils/` |
| Same multistep business operation | `use-cases/` |
| Platform, third-party SDK, DTO differences | Adapter |
| Similar appearance today, but nothing more | Keep separate; reuse lower-level primitives |

The key question:

> When requirements change, should these implementations change together for the same reason?

### 3.2 Shared UI must meet all of these conditions

- A neutral name describes it without referring to a feature.
- Consumers have the same state, interaction, accessibility, and platform contracts.
- They are expected to change for the same reason.
- It does not import routes, APIs, authentication, storage, Use Cases, or feature stores.
- Props do not contain page names, routes, feature enums, or consumer-specific booleans.
- Reuse does not depend on extensive internal style overrides or `mode="custom"`.

### 3.3 When to abstract

- First occurrence: a clear feature-local implementation.
- Second occurrence: evaluate semantics and reasons to change; extracting only lower-level capabilities may be sufficient.
- Third stable use: usually extract shared code and migrate the existing implementations to it.
- Project design-system primitives and security invariants may be extracted earlier.

### 3.4 Component APIs

- A closed set of visual differences: `variant`, `size`, `tone`.
- Genuine structural differences: composition, children, slots.
- State controlled by the business layer: controlled props + `onXxx`.
- Do not use excessive booleans, oversized configs, route checks, or unrestricted style escape hatches.
- After extracting shared code, update all consumers and delete the old duplicate versions.

## 4. Logic and control flow

Recommended path:

```text
Page
├── View / feature UI -> shared UI
└── Controller Hook
    ├── optional Use Case
    ├── Reducer / Model
    └── API / Adapter
```

### 4.1 Simple flows

You may use a direct handler for a small amount of local state, a single synchronous action, or a single API call without business rules. Do not add a Use Case, Repository, Factory, or class just for the sake of structure.

### 4.2 Complex flows

When a user action involves validation, multiple side effects, cache consistency, a submission lock, cancellation, retries, idempotency, or multiple entry points, use:

- Controller: React lifecycle, UI state, action entry points, navigation, and feedback.
- Use Case: business steps, their order, and typed results, independent of React.
- Reducer / state machine: mutually exclusive states, illegal combinations, and explicit transitions.
- Adapter: platform, native module, third-party SDK, and DTO differences.
- Strategy: multiple actual implementations of the same algorithm.
- Repository: a consistent policy across multiple data sources, caching, or offline behavior.

### 4.3 Prohibited call chains

Prohibited:

```ts
const handleSave = () => submit();
const submit = () => executeSave();
const executeSave = () => service.save(form);
```

Keep a function only if it adds at least one of the following:

- Input or output transformation
- Validation / invariants
- Branching and sequencing decisions
- Error mapping
- Side-effect boundary
- Cancellation / lock / idempotency
- An interchangeable implementation
- Necessary instrumentation

Controller actions must lead directly to the single point of orchestration. Do not use an EventBus, Context, or module singleton to hide a flow that could be expressed directly within the same page.

### 4.4 Use Case constraints

- Name them after user intent: `publishPost`, `updateProfile`.
- Do not import React, React Native UI, Expo Router, toasts, or page components.
- Return a discriminated union / typed result.
- Do not create a Use Case that merely wraps a one-line API call.
- Do not create an unnecessary interface or class for every function.

### 4.5 Reducer constraints

- Reducers perform only pure state transitions.
- Controllers / Use Cases handle requests, navigation, storage, and toasts.
- Use discriminated unions to prevent illegal boolean combinations.
- Do not require a third-party state-machine library.

## 5. Directories and dependencies

```text
app -> feature pages
feature pages -> feature ui -> shared/ui
feature pages -> hooks/controllers
hooks/controllers -> use-cases / model / api / shared
use-cases -> model / api / shared
api -> shared/api
```

- `shared` does not import `features`.
- UI does not import routes, APIs, authentication, storage, or Use Cases.
- Models do not import React, routers, or APIs.
- Use Cases do not import UI, routers, or toasts.
- APIs do not import Page/UI.
- Do not expose feature internals through unbounded `export *`.
- Do not create `helpers.ts`, `common.ts`, `manager.ts`, or `service.ts` without a clear responsibility.

## 6. Required checks before completion

- [ ] Existing components, hooks, tokens, rules, and flows have been searched for reusable implementations.
- [ ] Sharing is based on matching semantics, state contracts, and reasons to change.
- [ ] Abstractions are at the lowest stable layer, with no one-size-fits-all component.
- [ ] Shared component props have no consumer-specific special cases.
- [ ] Replaced duplicate implementations have been deleted, and direct consumers have been checked.
- [ ] Each major action has a single point of orchestration.
- [ ] No `handle -> do -> execute -> service` pass-through chain remains.
- [ ] Every Use Case, Reducer, Strategy, Adapter, and Repository addresses a concrete need.
- [ ] Use Cases have no UI/router dependencies; Reducers have no side effects.
- [ ] Relevant shared UI, Controllers, Use Cases, and Reducers have been tested according to risk.
- [ ] The final response explains reuse decisions, action paths, reasons for choosing patterns, verification results, and remaining deviations.
