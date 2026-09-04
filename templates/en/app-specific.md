# App-specific mobile development rules

> Copy this template to `mobile/docs/agents/app-specific.md` or an equivalent project-level document in your project. Fill in your app's actual configuration. Mark anything not yet decided as “undecided”; do not use another app's configuration as a substitute. The 22 sections below match the items in section 11 of the full engineering standards.

## 1. Project identity

- Rules language: `en`
- App name:
- `mobile/` path:
- Package name:
- Expo SDK:
- React Native:
- React:
- Package manager:
- Native workflow:

## 2. Required documents

- Architecture:
- API contract:
- Data and storage:
- Keyboard layout:
- Testing standards:
- Release standards:

## 3. Directories and path aliases

- Uses the standard directory structure:
- Approved additional directories:
- Conditions for using `model`:
- Conditions for using `use-cases`:
- Path aliases:
- `index.tsx` convention:
- Page export convention:

## 4. Routing and navigation

- Route groups:
- Root Stack:
- Tabs:
- Tab Stack:
- Cross-tab screens:
- Modals:
- Route constants:
- Animation requirements:
- Back-navigation requirements:

## 5. Design tokens

- Authoritative definitions in code:
- Figma Variables / Library:
- Colors:
- Spacing:
- Radius:
- Shadows:
- Typography:
- z-index:
- Theme modes:

## 6. Fonts and languages

- Supported languages:
- Fonts:
- Fallbacks:
- Font-weight mapping:
- Dynamic type:
- Maximum text scaling:

## 7. Motion

- Motion tokens:
- Navigation:
- Modal / Sheet:
- Press feedback:
- Loading:
- Reduced motion:
- Prohibited implementations:

## 8. Styling and base components

- Styling system:
- Rules for colocating or separating styles:
- Theme entry point:
- Button entry point:
- Input entry point:
- Switch entry point:
- Checkbox entry point:
- Radio entry point:
- Image entry point:
- Avatar entry point:
- Modal entry point:
- Sheet entry point:
- Entry point for keyboard-aware components:
- Loading entry point:
- Empty-state entry point:
- Error-state entry point:

## 9. Shared component catalog

- Public primitives / patterns:
- Public entry points:
- Direct consumers:
- Variants:
- Deprecated components:
- Component example locations:
- Policy for custom style overrides:

## 10. Images, SVG, and icons

- Asset directories:
- SVG integration:
- Icon sources:
- Bitmaps for different pixel densities:
- Placeholders:
- Fallbacks:
- Naming rules:

## 11. Data, API, and state

- API client:
- Response envelope:
- Conditions for using a Controller:
- Conditions for using a Use Case:
- Conditions for using a Reducer:
- Conditions for using a Strategy:
- Conditions for using an Adapter:
- Conditions for using a Repository:
- Authentication:
- Tokens:
- KV:
- Offline data:
- File cache:
- Scoped events / state:
- Prohibited approaches:

## 12. Control-flow conventions

- Main action paths:
- Controller return structure:
- Use Case result conventions:
- Error mapping:
- Navigation ownership:
- Submission locks:
- Cancellation rules:
- Stale-result rules:

## 13. Reuse strategy

- Reuse search scope:
- Feature First:
- When to move code into shared:
- Migration process:
- Process for moving shared code back into a feature:
- Allowed slots / variants:
- When to revisit duplicated code:

## 14. Platform configuration

- Minimum iOS version:
- Minimum Android version:
- Edge-to-edge:
- StatusBar:
- System navigation:
- Safe area:
- Permissions:
- Platform differences:

## 15. Performance and rendering

- Target devices:
- Critical performance paths:
- Release profiling:
- Tools:
- Budgets:
- List sizes:
- Virtualized lists:
- Image cache:
- Cache owners:
- Cleanup strategy:

## 16. Testing strategy

- Test runner:
- Tools for each testing layer:
- Use Case tests:
- Reducer tests:
- Controller tests:
- Native mocks:
- Setup / cleanup:
- Test file inclusion rules:
- Test IDs:
- Coverage:
- Flaky tests:
- Acceptance test matrix for both platforms:
- CI checks:

## 17. Security and privacy

- Data classification:
- Authentication contract:
- Protected storage:
- KV / database / cache:
- API origins:
- HTTP exceptions:
- Deep links:
- WebView:
- Permissions:
- Log redaction:
- SDK consent:
- Logout cleanup:
- Deletion cleanup:

## 18. Dependency constraints

- Approved UI dependencies:
- Approved animation dependencies:
- Approved gesture dependencies:
- Approved native modules:
- Approval process for new dependencies:
- Workspace dependency rules:
- Expo config plugin rules:

## 19. Figma workflow

- Team / project:
- Design Library:
- Screen files:
- Dev Mode / Code Connect:
- Asset export permissions:
- Token and shared component alignment process:
- Devices used for visual acceptance testing:

## 20. Validation and delivery commands

- Format:
- Lint:
- Typecheck:
- Test:
- Dependency boundary:
- iOS:
- Android:
- Minimum delivery checks:
- CI checks:
- Where existing issues are documented:

## 21. Project-specific prohibitions

- Project-specific prohibitions:

## 22. Approved exceptions

Record each exception separately:

- Shared rule:
- Reason for the exception:
- Scope of impact:
- Alternative measures:
- Acceptance method:
- Expiration or review conditions:
