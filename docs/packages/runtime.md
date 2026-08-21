# @fractalui/runtime

A config-driven renderer: describe a screen as data, render it with the kit. Useful for internal tools, generated admin UIs and low-code surfaces where the layout **is** data.

```bash
npm i @fractalui/runtime
```

## Exports

| Export | Purpose |
| --- | --- |
| `FractalApp` | the app renderer — takes an app/page config and renders it |
| `definePage` | typed helper to declare a page config |
| `AppConfig`, `PageConfig`, `TypedPage` | config shapes |
| `Visualization`, `TypedVisualization`, `UnknownRow` | data-visualization descriptors |
| `CreateAction` | action binding descriptor |

## Idea

```tsx
import { FractalApp, definePage } from "@fractalui/runtime";

const page = definePage({
  title: "Users",
  // describe the page as data: sections, tables, forms, actions…
});

<FractalApp config={{ pages: { users: page } }} />;
```

The runtime builds the screen from the layers below it (`patterns` → `primitives` → `tokens`), so a config-rendered app looks and behaves like a hand-written one.

!!! note
    The runtime is the youngest layer and its config schema is still evolving. For exact field shapes, follow the exported types (`AppConfig`, `PageConfig`, `TypedPage`) — they are the source of truth.
