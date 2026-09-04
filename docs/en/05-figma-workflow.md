# 5. Figma inspection and page implementation rules

### 5.1 Triggers

Any of the following triggers the Figma workflow:

- The user provides a Figma URL
- The user provides a Figma node
- The user provides a design screenshot
- The user explicitly asks to create or modify a page according to a design

### 5.2 Confirm before starting

Before generating page code, you must confirm:

1. The shared standards and project-level rules have been read in full.
2. The current Expo / React Native configuration and permitted dependencies.
3. The current app's tokens, fonts, icons, and entry points for existing components.
4. The page's feature and route hierarchy.
5. The page states, scope of interaction, and data boundaries the user requested.

### 5.3 Required Figma inspection order

#### Step 1: Inspect the entry node

Start with the entire screen, frame, or section the user provided. A top-level screenshot alone does not provide everything needed for implementation.

First inspect:

- Metadata / node tree
- Frame dimensions and Auto Layout
- Direct child nodes
- Component instances
- Hidden layers
- Variable / style references
- Assets and vector groups

#### Step 2: Classify nodes by responsibility

Classify key nodes as:

- Page shell and background
- Safe area, header, navigation
- Tab, segment
- Section header
- Card, list row
- Button, input, picker
- Modal, sheet, dialog
- Icon, SVG group
- Images, illustrations, background assets
- Chart, visualization
- System UI

#### Step 3: Inspect key child nodes in detail

Continue inspecting until you can confirm:

- Dimensions and constraints
- Padding, gaps, and alignment
- Typography and line height
- Fill, stroke, radius, and shadow
- Variants / component properties
- Clipping, masks, z-index, and overflow
- Asset types and export boundaries
- Default, selected, disabled, loading, error, and other states

You must inspect the internal elements of these composite controls individually:

- TextField / SearchField
- Select / Dropdown
- Date / Time picker row
- Tab / Segment
- Card action
- Chart tooltip / legend

Do not inspect only the outer frame and then use approximate icons or guess internal spacing.

#### Step 4: Record the node inspection checklist

Before changing code, you must record:

- Entry node ID and name
- IDs and names of inspected key child nodes
- Where each node will be implemented in code
- Planned SVG / PNG exports
- Explicitly skipped nodes and reasons

If tools cannot access a node or lack the required permissions, you must explain what evidence you used instead, which screenshots you relied on, and what remains unconfirmed.

### 5.4 Figma-to-code workflow

```text
Figma entry node
  ↓
Inspect the node tree, dimensions, and layout
  ↓
Classify by page responsibility
  ↓
Inspect key composite nodes in detail
  ↓
Record node-to-file/component/asset mappings
  ↓
Map tokens, components, fonts, and interactions
  ↓
Implement feature page / UI
  ↓
Run visual and interaction acceptance checks on iOS / Android
```

### 5.5 Auto Layout mapping

- Prefer mapping Auto Layout to Flexbox relationships.
- Determine width and height behavior from `hug`, `fill`, `fixed`, and `min/max constraint`.
- Do not rely on extensive absolute positioning for structures that normal layout can express.
- Use absolute positioning only for explicit layers, badges, decorations, and overlays.

### 5.6 Component and variant mapping

- Search the current app's existing components first and confirm whether structure and semantics match.
- Map Figma component properties to a defined set of type-safe props.
- Prefer mapping variants to enums such as `variant`, `size`, `tone`, or `state`.
- Do not accept obvious structural deviations merely to “reuse an existing component.”
- Place new components in the current feature by default.
- Move them into `shared` only after confirming stable cross-feature reuse.

### 5.7 Variables and tokens

- Map Figma variables to the current app's tokens, not fixed values in a shared library.
- When Figma uses aliases, prefer semantic tokens in code rather than raw color values.
- When Figma and code tokens have drifted apart, do not choose one without explanation.
- You must explain the differences and follow the project's source of truth.

### 5.8 Typography and layout values

- Confirm the text's language, the font's character coverage, and Figma's font fallbacks.
- Select the actual `fontFamily` from fonts loaded by the app.
- Map font size, line height, letter spacing, and weight together.
- Do not add font packages or assets without authorization.
- By default, use the same numeric values from Figma in React Native logical pixels.
- Make platform-specific adjustments only for justified differences caused by font rendering, native controls, or platform behavior, and record the reason.

### 5.9 Images, SVGs, and asset naming

- Prefer local SVG exports for functional icons, small status graphics, and scalable vectors.
- Use appropriately scaled local images for photos, complex illustrations, banners, and bitmap textures.
- Prefer exporting an already-composed complex Figma vector group as a single asset.
- Write SVG by hand only when its structure is simple and it needs shape or color changes at runtime.
- Do not replace production local assets with network URLs, base64, or look-alike third-party icons unless the project explicitly permits it.
- Do not use low-resolution screenshots as production assets.
- Do not embed accessible text in images unless the original design is a bitmap that cannot be separated into elements.

Recommended:

```text
icon-arrow-left.svg
profile-avatar-placeholder.png
empty-history-illustration.svg
```

Prohibited:

- Hashes
- Random strings
- Temporary export-tool names
- `image-1.png`
- File names that do not reveal their purpose

You must give tool-generated temporary assets their final names within the same task; unused assets should be deleted.

### 5.10 System UI

The following are part of the device environment by default, not the app's own UI:

- iOS home indicator
- Status-bar time, battery, cellular signal, and Wi-Fi
- Android system navigation bar
- Device frames and rounded-screen masks

Do not draw fake system elements. Pages must handle safe areas, StatusBar, and system backgrounds correctly. Exceptions are allowed only for marketing mockups or images showing a device.

### 5.11 Interaction intent

You must determine the following from the design and prototype:

- Tap targets and hit areas
- Tab / segment switching
- Input focus, placeholders, and validation
- Opening and closing sheets / modals
- Loading, empty, error, and disabled states
- Boundaries between scrolling and fixed areas
- Differences between forward navigation, back, and close

If Figma shows only static states:

- Do not invent real business rules.
- Local presentation states permitted by the task may be implemented.
- Do not connect real networking, persistence, authentication, or business flows without authorization.
- Identify which behaviors remain placeholders.

### 5.12 Implementation plan and visual acceptance checks

Before writing code, you should provide:

1. Applicable key project rules
2. Full paths of files to create or modify
3. Each file's responsibility
4. Figma child-node inspection checklist
5. Existing components, tokens, and assets you plan to reuse
6. Known uncertainties and conservative assumptions

After implementation, check at least:

- Structure and hierarchy
- Padding, gaps, and alignment
- Font size, line height, weight, and letter spacing
- Colors, strokes, corner radii, and shadows
- Image cropping and SVG dimensions
- Scrolling, fixed footers, and safe areas
- Pressed, focused, selected, and disabled states
- Small screens and long text
- Native iOS / Android appearance and behavior

Web checks can help verify routing and basic rendering, but they cannot replace iOS / Android acceptance checks for visuals, keyboards, safe areas, modals, and transitions.

In the final response, explain:

- Which parts of the design have been implemented
- Remaining deviations from Figma
- Reasons for deviations: missing assets, platform behavior, dependency constraints, or incomplete designs
- Verified platforms and states
- Tokens, fonts, motion, or business behavior that still require a user decision

---
