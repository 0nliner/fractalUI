# Patterns & App shell

`@fractalui/patterns` composes primitives into the big pieces of an application — so a whole admin screen is configuration, not layout code.

## AppShell

The application frame: a navigation rail with sections, a header, the main area, and an optional docked panel.

```tsx
import { AppShell, DockPanel, type ShellSection } from "@fractalui/patterns";

const sections: ShellSection[] = [
  {
    key: "kb",
    label: "Knowledge base",
    icon: <BookIcon size={18} />,
    active: pathname.startsWith("/kb"),
    onSelect: () => navigate("/kb"),
    items: [
      { key: "tree", label: "Tree", onSelect: () => navigate("/kb") },
      { key: "tasks", label: "Tasks", onSelect: () => navigate("/kb/tasks") },
    ],
  },
];

<AppShell
  brand={<button className="brand" onClick={() => navigate("/")}>My App</button>}
  headerRight={<ThemeToggle />}
  sections={sections}
  railFooter={[{ key: "logout", icon: <LogOutIcon size={16} />, label: "Log out", onPress: logout }]}
  rightDock={
    <DockPanel isOpen={open} width={width} onWidthChange={setWidth} min={340} max={880} defaultWidth={420}>
      <Assistant />
    </DockPanel>
  }
>
  {children}
</AppShell>;
```

- **`sections`** — the nav rail. Each `ShellSection` has an icon, a label, an `active` flag, `onSelect`, and nested `items`.
- **`railFooter`** — pinned actions at the bottom of the rail (`NavRailItem[]`).
- **`rightDock`** — a docked, resizable panel (not an overlay). Pair with `DockPanel` for the drag-to-resize behavior.
- **`headerRight`**, **`brand`**, **`backdrop`**, **`mainProps`** — the surrounding chrome.

## DockPanel & ResizablePanel

`DockPanel` is a side panel that shares layout with the main content (it pushes, it doesn't cover) and is drag-resizable. `ResizablePanel` (in `@fractalui/primitives`) is the lower-level building block if you need resizing elsewhere.

## Schema-driven data UI

Skip the boilerplate for tables and forms:

```tsx
import { AutoTable, AutoForm, FilterPanel } from "@fractalui/patterns";

<AutoTable
  columns={[
    { key: "name", header: "Name" },
    { key: "status", header: "Status" },
    { key: "total", header: "Total", align: "end" },
  ]}
  rows={rows}
/>;

<AutoForm
  schema={{
    name: { type: "text", label: "Name" },
    role: { type: "select", label: "Role", options: roles },
  }}
  onSubmit={save}
/>;
```

## Other patterns

- **`Toaster`** — app-level notifications (`ToastItem`).
- **`FilterPanel`** — faceted filtering UI (`Facet` / `FacetValue`).
- **`Search`**, **`Navigation`**, **`CardGrid`**, **`Feed`**, **`StorefrontShell`**, **`DesignGallery`** — higher-level compositions for common screens.

→ See the [`@fractalui/patterns` reference](../packages/patterns.md) for the full export list.
