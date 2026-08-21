# @fractalui/tokens

The styling foundation: a typed design-token contract (vanilla-extract) that every fractalUI component reads from.

```bash
npm i @fractalui/tokens
```
```ts
import "@fractalui/tokens/styles.css";
```

## Exports

| Export | Purpose |
| --- | --- |
| `vars` | the theme **contract** — `vars.color.*`, `vars.space.*`, `vars.radius.*`, typography, shadows, motion, z-index |
| `lightTheme`, `darkTheme` | ready theme classes to apply to a root element |
| `lightValues`, `darkValues` | the raw values behind those themes (spread them to build your own) |
| `defineThemeValues(values)` | typed helper to author a custom theme values object |
| `media`, `bp` | breakpoint queries (mobile-first) |
| `responsive(base, at)` | ergonomic responsive style wrapper |
| `container(name)`, `atContainer(name, minWidth, styles)` | container queries |
| `ThemeValues`, `Vars`, `ColorTokens`, `SpaceTokens`, … | the token types |

## Use it

```ts
import { style } from "@vanilla-extract/css";
import { vars, responsive } from "@fractalui/tokens";

export const panel = style(
  responsive(
    { background: vars.color.surface, borderRadius: vars.radius.md, padding: vars.space.sm },
    { md: { padding: vars.space.md } }
  )
);
```

See [Theming](../guide/theming.md) for light/dark, re-branding and density.
