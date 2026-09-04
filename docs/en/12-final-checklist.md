# 12. Final checklist

### Directories and architecture

- [ ] Page implementations are in the correct feature's `pages/`.
- [ ] Router files contain only entry points, layouts, or re-exports.
- [ ] UI, Controller hooks, Use Cases, Models, APIs, data, types, and utilities have clear responsibilities.
- [ ] Simple cases have not been burdened with unnecessary Controllers, Use Cases, Repositories, or classes.
- [ ] Code in `shared` has established, stable reuse or is explicitly designated as a design-system primitive, and has no business semantics.
- [ ] Dependencies follow the intended direction, with no reverse references, EventBus workarounds, or implicit global coupling.
- [ ] File naming, public entry points, and style organization follow the rules.

### Reuse and shared abstractions

- [ ] Existing implementations were searched before adding components, hooks, utilities, or flows.
- [ ] Reuse candidates are recorded, along with reasons to reuse directly, extend, extract lower-level functionality, or keep separate.
- [ ] Sharing is based on matching semantics, state contracts, and reasons to change—not merely visual similarity or copy counts.
- [ ] Abstractions are at the lowest stable layer, prioritizing tokens, primitives, behaviors, or pure rules.
- [ ] Shared component props contain no page names, routes, feature enums, consumer-specific booleans, or unrestricted style escape hatches.
- [ ] Old duplicate implementations were deleted after shared-code extraction, and all direct consumers were checked.
- [ ] Poor abstractions were split or moved back into features instead of extended with special cases to preserve a “reuse rate.”

### Control flow and design patterns

- [ ] Each major user action can be traced from its UI callback to a single point of orchestration.
- [ ] Key steps, short-circuit conditions, call ordering, error mapping, and success handling can be read in sequence within clear boundaries.
- [ ] No chains of pass-through wrappers such as `handle -> do -> execute -> service` remain.
- [ ] Each function used as an abstraction adds meaning, transformation, invariants, a boundary, concurrency control, or the ability to swap implementations.
- [ ] Use Cases do not depend on React, UI, toasts, or routers; Reducers do not execute side effects.
- [ ] Every Reducer, state machine, Strategy, Adapter, Repository, or class addresses a clearly identified source of complexity.
- [ ] Typed results, discriminated unions, and state invariants are used to avoid hidden branches and illegal states.

### Figma and visuals

- [ ] Entry nodes, node trees, Auto Layout, and key child nodes have been inspected.
- [ ] Node IDs, corresponding code locations, asset exports, and reasons for skipping nodes are recorded.
- [ ] Figma components / variants were first mapped to existing tokens, primitives, and patterns.
- [ ] Auto Layout is mapped appropriately to Flexbox.
- [ ] Components, variants, variables, and tokens have explicit mappings.
- [ ] Fonts, fallbacks, and multilingual glyphs are confirmed.
- [ ] Images and SVGs use production local assets with descriptive names.
- [ ] System UI is not hand-drawn.
- [ ] Layout, typography, colors, assets, states, safe areas, and cross-platform behavior have been checked.

### Interaction and platforms

- [ ] Controls use correct native semantics.
- [ ] Inputs, presses, toggles, disabled and loading states, and modals provide actual feedback.
- [ ] Keyboards do not obscure inputs or primary actions.
- [ ] Safe areas, StatusBar, system navigation bars, and edge-to-edge are verified.
- [ ] iOS and Android back behavior, gestures, permissions, fonts, modals, and system pickers have been evaluated.
- [ ] Key controls have accessibility roles, labels, states, and test entry points.

### Quality and delivery

- [ ] No unapproved dependencies were added.
- [ ] There are no duplicate tokens, business rules, business sources of truth, or unbounded caches.
- [ ] Shared UI, Use Cases, Reducers, and Controllers have appropriate risk-based tests.
- [ ] Risk-appropriate format, lint, typecheck, test, bundle, and native checks have run.
- [ ] Success, failure, cancellation, loading, empty, stale, and race paths are covered.
- [ ] Issues introduced by this task are clearly distinguished from pre-existing issues.
- [ ] The final response explains key files, reuse decisions, action flows, verification results, and remaining deviations.

### Security and privacy

- [ ] No real secrets are present in client bundles.
- [ ] Tokens do not enter public React state, routes, URLs, logs, or analytics.
- [ ] Authentication uses a single source of truth, persist-before-publish, local-first logout, and stale-result fencing.
- [ ] Production uses controlled HTTPS origins.
- [ ] External URLs, deep links, files, and network responses are treated as untrusted input.
- [ ] Permissions are requested on demand, with fallbacks after denial.
- [ ] Logout, account switching, and data deletion have explicit cleanup policies.
- [ ] Security acceptance checks have been completed on iOS / Android release builds.

---

## 13. Summary in one sentence

```text
Figma / project facts
        ↓
app route entry point
        ↓
feature page
   ┌────┴────────────────────┐
   ↓                         ↓
feature ui              controller hook
   ↓                         ↓
shared ui primitive     optional use case
                             ↓
                     model / api / adapter
                             ↓
                    shared infrastructure
        ↓
iOS / Android interaction, performance, security, and visual acceptance checks
```

Shared standards define how to organize and verify code; project rules define what this app uses. Always **search before creating, abstract code that changes for the same reasons, share at the lowest layer, keep one orchestration point per action, remove pass-through wrappers, and use patterns only to address actual complexity.**
