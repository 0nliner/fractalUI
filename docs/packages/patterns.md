# @fractalui/patterns

Opinionated compositions of primitives — the big pieces of an app, ready to drop in.

```bash
npm i @fractalui/patterns
```
```ts
import "@fractalui/patterns/styles.css";
```

## Exports

| Export | What it is |
| --- | --- |
| `AppShell` | full application frame — nav rail, sections, header, main, docked panel |
| `DockPanel` | docked, drag-resizable side panel (pushes content, not an overlay) |
| `Navigation` | standalone navigation composition |
| `AutoTable` | table from `columns` + `rows` (schema-driven) |
| `AutoForm` | form from a field schema |
| `FilterPanel` | faceted filtering UI (`Facet`, `FacetValue`) |
| `Search` | search surface |
| `CardGrid`, `Feed` | list/grid compositions |
| `Toaster` | app-level notifications (`ToastItem`) |
| `StorefrontShell` | e-commerce style shell |
| `DesignGallery` | multi-screen design/preview gallery (`DesignScreen`) |

Supporting types: `ShellSection`, `FieldSchema`, `ObjectSchema`, `AutoColumn`, `AutoFormValues`.

## Example

```tsx
import { AppShell, DockPanel, AutoTable } from "@fractalui/patterns";

<AppShell sections={sections} railFooter={footer} rightDock={<DockPanel {...dock}>{aside}</DockPanel>}>
  <AutoTable columns={cols} rows={rows} />
</AppShell>;
```

See the [Patterns & App shell guide](../guide/patterns.md) for a fuller walkthrough.
