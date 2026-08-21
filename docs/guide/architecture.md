# Architecture

fractalUI is deliberately **layered**. Each layer is a package, each depends only on the ones below it, and you can stop at any layer.

```
┌─────────────────────────────────────────────┐
│  @fractalui/runtime   config → screens        │
├─────────────────────────────────────────────┤
│  @fractalui/patterns  AppShell, DockPanel,    │
│                       AutoTable, AutoForm…     │
├─────────────────────────────────────────────┤
│  @fractalui/primitives  Button, Tree, Table,  │
│                         BlockEditor, DatePicker│
├──────────────────────┬──────────────────────┤
│  @fractalui/tokens    │  @fractalui/icons      │
│  (design tokens)      │  (icon set)            │
└──────────────────────┴──────────────────────┘
         @fractalui/data  (shared data utils)
```

## The rule of layers

- **tokens / icons** — the foundation. No React components, just design decisions (color, space, radius, type, density, breakpoints) and icons. Everything above reads from here.
- **primitives** — headless, accessible React components built on [React Aria](https://react-spectrum.adobe.com/react-aria/). They carry behavior and a11y; their look comes entirely from tokens.
- **patterns** — opinionated compositions of primitives: a full `AppShell`, a resizable `DockPanel`, schema-driven `AutoTable` / `AutoForm`, `FilterPanel`, `Toaster`. This is where "a screen" becomes one component.
- **runtime** — a renderer that turns **config** into screens (`FractalApp`, `definePage`). Describe a page as data; the runtime builds it from the layers below.

## Headless means you own the markup

Primitives don't ship a visual opinion baked into the DOM. They give you the *structure and behavior*; the *appearance* is tokens + vanilla-extract. That's why you re-brand by changing tokens, not by forking components.

## Styling model: vanilla-extract

All styling is [vanilla-extract](https://vanilla-extract.style/) `.css.ts` — CSS authored in TypeScript, extracted to static stylesheets at build time (zero runtime). Two consequences worth knowing:

- **Selectors target `&`.** Component styles are written against the element itself; you compose, you don't cascade over internals.
- **Density and brand are token overrides.** Instead of forking a component to make it denser or on-brand, you override the relevant tokens. See [Theming](theming.md).

## Adopt as much as you need

| You want… | Take |
| --- | --- |
| Just a design language | `@fractalui/tokens` |
| Accessible building blocks | `+ @fractalui/primitives` |
| A whole admin/app shell | `+ @fractalui/patterns` |
| Screens generated from config | `+ @fractalui/runtime` |

→ Next: [Theming](theming.md) · [Patterns & App shell](patterns.md)
