# 05 Figma Workflow

> This document defines the inspection, analysis, implementation, and acceptance workflow from Figma to React Native / Expo. Concrete Figma files, Libraries, Tokens, and fonts belong in project-specific rules.

## Trigger

Apply this document whenever the user provides a Figma URL, node, screenshot, or explicitly requests creating or modifying a screen from a design.

When Figma is not in scope, node inspection and visual mapping steps do not apply, but asset, component-responsibility, and native-quality rules remain useful.

## Before starting

Confirm:

1. The shared and project-specific rules have been read in full
2. Current Expo / React Native configuration and approved dependencies
3. The current App's Tokens, fonts, icons, and existing component entry points
4. The screen's feature and route hierarchy
5. Requested screen states, interaction scope, and data boundaries

Do not start generating screen code until these are confirmed.

## Required Figma inspection order

### 1. Read the entry node

Treat the provided screen, frame, or section as the entry. Do not assume a top-level screenshot contains enough implementation detail.

Inspect first:

- metadata / node tree
- frame size and Auto Layout
- direct children
- component instances
- hidden layers
- variable / style references
- assets and vector groups

### 2. Classify by responsibility

Classify important nodes as:

- Screen shell and background
- safe area / header / navigation
- tab / segment
- section header
- card / list row
- button / input / picker
- modal / sheet / dialog
- icon / SVG group
- image / illustration / background asset
- chart / visualization
- system UI

### 3. Inspect critical descendants

Continue into nodes that affect implementation until these facts are known:

- Dimensions and constraints
- padding, gap, and alignment
- typography and line height
- fill, stroke, radius, and shadow
- variant / component property
- clipping, mask, z-index, and overflow
- Asset type and export boundary
- Default, selected, disabled, loading, error, and other states

Inspect internal elements separately for compound controls such as:

- TextField / SearchField
- Select / Dropdown
- Date / Time picker row
- Tab / Segment
- Card action
- Chart tooltip / legend

Do not inspect only the outer frame and then approximate icons or guess internal spacing.

### 4. Produce a node-inspection manifest

Before changing code, output or record a “Figma descendant inspection manifest” containing at least:

- Entry node ID and name
- Key inspected child node IDs and names
- The code destination for each node
- Planned SVG / PNG exports
- Nodes intentionally skipped and the reason

If tools cannot access a node or permission is missing, state the fallback evidence, screenshot used, and facts that remain unconfirmed.

## Design-to-code mapping

### Auto Layout

- Map Auto Layout to flex relationships by default.
- Determine size behavior from hug, fill, fixed, and min/max constraints.
- Do not reproduce normal layout with excessive absolute positioning.
- Use absolute positioning only for explicit layers, badges, decorations, and overlays.

### Components and Variants

- Search existing components in the current App first and confirm structural and semantic fit.
- Map Figma component properties to finite, type-safe props.
- Map variants to enums such as `variant`, `size`, `tone`, and `state`.
- Do not force reuse of an existing component with a clear structural mismatch.
- Place a new component in the current feature by default; move it to shared only after stable cross-feature reuse is established.

### Variables and Tokens

- Map Figma variables to the current App's Tokens, not values defined by this shared package.
- When Figma uses aliases, code should prefer semantic Tokens over raw color values.
- Do not silently choose one side when Figma and code Tokens have drifted. Report the difference and follow the project's declared source of truth.

### Typography

- Confirm text language, font coverage, and Figma fallback.
- Select the actual `fontFamily` loaded by the current App.
- Map font size, line height, letter spacing, and weight together.
- Do not add a font package or asset without approval.

### Layout values

Figma values map to the same numeric React Native logical pixels by default. Apply platform-specific adjustments only when font rendering, native controls, or platform behavior provide evidence for the difference, and record the reason.

## Images and SVG

- Prefer local SVG for functional icons, small status graphics, and scalable vectors.
- Use appropriately scaled local bitmaps for photos, complex illustrations, banners, and bitmap textures.
- Prefer exporting a completed complex Figma vector group as a whole instead of guessing its paths in code.
- Hand-write SVG only when runtime shape or color changes are required and the structure is simple.
- Do not replace production assets with network URLs, base64, or approximate third-party icons unless the project explicitly allows it.
- Do not use a low-resolution screenshot as a production asset.
- Do not bake accessible text into an image unless it is inseparable in the original bitmap.

Use semantic asset names, for example:

~~~text
icon-arrow-left.svg
profile-avatar-placeholder.png
empty-history-illustration.svg
~~~

Do not retain hashes, random strings, temporary exporter names, or ambiguous names such as `image-1.png`. Rename tool-generated temporary assets in the same task and remove unused assets.

## System UI

These elements in Figma are device environment by default, not business UI:

- iOS Home Indicator
- Status bar time, battery, signal, and Wi-Fi
- Android system navigation bar
- Device frame and screen-corner mask

Handle safe area, StatusBar, and system backgrounds correctly instead of drawing fake system elements. The exception is an explicit request for a marketing mockup or device presentation.

## Interaction intent

Determine from the design and prototype:

- Tap target and hit area
- Tab / Segment switching
- Input focus, placeholder, and validation states
- Sheet / modal open and close
- loading / empty / error / disabled states
- Scrollable and fixed-region boundaries
- Difference between navigation forward, back, and close

If Figma shows only a static state, do not invent real business rules. Implement local demonstration state only when allowed by the task and mark placeholder behavior clearly.

## Output before implementation

Before writing code, provide a concise directory mapping:

1. Applicable key project rules
2. Full paths to files that will be created or modified
3. Responsibility of each file
4. Figma descendant inspection manifest
5. Existing components, Tokens, and assets to reuse
6. Known uncertainties and conservative assumptions

Actual files must follow this mapping. If the plan changes during implementation, update the mapping.

## Visual acceptance

After implementation, verify at minimum:

- Structure and hierarchy
- padding, gap, and alignment
- Font size, line height, weight, and letter spacing
- Color, stroke, radius, and shadow
- Image crop and SVG dimensions
- Scroll, fixed footer, and safe area
- press, focus, selected, disabled, and other states
- Small screens and long text
- Native behavior on iOS and Android

Web can quickly confirm route reachability and basic rendering, but it cannot replace native acceptance for visuals, keyboard, safe area, Modal, and transitions.

## Delivery notes

At delivery, state:

- What was reproduced
- Remaining deviations from Figma
- Reasons for deviations, such as missing assets, platform behavior, dependency constraints, or incomplete design
- Platforms and states verified
- Tokens, fonts, motion, or business behavior still requiring a user decision
