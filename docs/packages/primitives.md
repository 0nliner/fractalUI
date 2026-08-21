# @fractalui/primitives

Headless, accessible React components — the core of the kit. Built on [React Aria Components](https://react-spectrum.adobe.com/react-aria/), so keyboard interaction, focus management and ARIA are handled; the look comes from [`@fractalui/tokens`](tokens.md).

```bash
npm i @fractalui/primitives @fractalui/tokens react-aria-components
```
```ts
import "@fractalui/tokens/styles.css";
import "@fractalui/primitives/styles.css";
```

## What's inside

**Inputs & forms** — `Button`, `TextField`, `TextArea`, `NumberField`, `Select`, `ComboBox`, `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `Switch`, `Slider`, `RangeField`, `Field`, `DatePicker`, `DateRangePicker`, `Rating`, `Dropzone`, `TagPicker`, `CityPicker`.

**Data display** — `Table` primitives, `Tree` (with facets, filtering, drag-and-drop, context menus), `Card`, `Badge`, `Chip`, `Avatar`, `Gallery`, `Pagination`, `EmptyState`, `Rating`.

**Overlays & menus** — `Dialog`, `DialogTrigger`, `Drawer`, `Menu` / `MenuTrigger` / `MenuItem`, `Tooltip`, `ImageLightbox`, `NavFlyout`, `FloatingWidget`.

**Navigation & layout** — `NavRail`, `Breadcrumbs`, `Tabs`, `EditorTabs`, `ViewSwitcher`, `ResizablePanel`, `Container`, `Stack`, `Inline`, `Grid`, `Section`, `MasterGrid`.

**Rich content** — `BlockEditor` (block-based rich text: text, tiles/12-col layout, tables, images, per-block color) with custom-block support (`CustomBlockDef`, `EditorBlock`), `AgentChat` (a chat surface with tool-call rendering).

**Feedback** — `Notification`, `Skeleton`, `Shimmer`, `LavaLamp`.

Every component ships a matching `…Props` type.

## Example

```tsx
import { Tree, type TreeNode } from "@fractalui/primitives";

const nodes: TreeNode[] = [
  { id: "a", label: "Docs", children: [{ id: "a1", label: "Getting started" }] },
];

<Tree
  nodes={nodes}
  selectedIds={selected}
  onSelectionChange={setSelected}
  menuItems={(node, controls) => [
    { key: "rename", label: "Rename", onAction: () => controls.startRename(node.id) },
  ]}
/>;
```

Because the components are headless, you keep control of composition and appearance — the primitive supplies behavior and accessibility.
