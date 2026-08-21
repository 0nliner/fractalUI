# Theming

Styling in fractalUI is [vanilla-extract](https://vanilla-extract.style/): typed CSS-in-TypeScript, extracted to static stylesheets at build time. The look of the whole kit is driven by one **theme contract** — `vars` from `@fractalui/tokens`.

## The theme contract: `vars`

`vars` is a typed set of CSS variables — color, space, radius, typography, shadows, motion, z-index. Components read from it; you read from it in your own styles:

```ts
// my-card.css.ts
import { style } from "@vanilla-extract/css";
import { vars } from "@fractalui/tokens";

export const card = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space.md,
  gap: vars.space.xs,
});
```

Because the whole kit uses the same `vars`, your components sit visually inside the system for free.

## Light & dark

`@fractalui/tokens` ships ready themes. Apply a theme class to a root element:

```tsx
import { darkTheme, lightTheme } from "@fractalui/tokens";

<div className={darkTheme}>
  {/* everything here uses the dark values of `vars` */}
</div>;
```

Toggle by swapping the class on `<html>`/`<body>`.

## Re-brand or change density — override tokens, don't fork

Instead of forking a component to change its color or density, build a theme with your values via `defineThemeValues` + `createTheme`:

```ts
// brand-theme.css.ts
import { createTheme } from "@vanilla-extract/css";
import { vars, defineThemeValues, darkValues } from "@fractalui/tokens";

export const brandTheme = createTheme(
  vars,
  defineThemeValues({
    ...darkValues,
    color: { ...darkValues.color, accent: "#6d5efc" },
    // tighten density by shrinking the space scale, etc.
  })
);
```

```tsx
<div className={brandTheme}>{/* kit now renders on-brand */}</div>
```

One override, applied everywhere — no component forks.

## Responsive

`@fractalui/tokens` is mobile-first. Use the breakpoint helpers instead of hand-writing media queries:

```ts
import { style } from "@vanilla-extract/css";
import { vars, media, responsive } from "@fractalui/tokens";

export const grid = style(
  responsive(
    { display: "grid", gridTemplateColumns: "1fr", gap: vars.space.sm },
    {
      md: { gridTemplateColumns: "1fr 1fr" },
      lg: { gridTemplateColumns: "repeat(3, 1fr)" },
    }
  )
);
```

`media.*` gives the raw breakpoint queries; `responsive(base, at)` is the ergonomic wrapper. Container queries are available via `container()` / `atContainer()`.

→ Next: [Patterns & App shell](patterns.md)
