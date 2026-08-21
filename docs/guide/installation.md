# Installation

fractalUI ships as several scoped packages. Install the layers you need — each works on its own, but higher layers depend on lower ones (installing `@fractalui/patterns` pulls in `primitives`, `tokens` and `icons` automatically).

## Packages

| Package | What it is |
| --- | --- |
| `@fractalui/tokens` | design tokens (vanilla-extract) — the styling foundation |
| `@fractalui/icons` | icon set |
| `@fractalui/primitives` | headless, accessible React components |
| `@fractalui/patterns` | composed patterns & app shell |
| `@fractalui/runtime` | config-driven renderer |
| `@fractalui/data` | data utilities for the runtime |

## Install

Most apps start with the primitives + tokens:

```bash
# npm
npm i @fractalui/primitives @fractalui/tokens

# pnpm
pnpm add @fractalui/primitives @fractalui/tokens

# yarn
yarn add @fractalui/primitives @fractalui/tokens
```

Building a full app shell? Add patterns:

```bash
npm i @fractalui/patterns
```

## Peer dependencies

The primitives are built on [React Aria Components](https://react-spectrum.adobe.com/react-aria/). Your app provides:

```bash
npm i react react-dom react-aria-components
```

- **React** `^18 || ^19`
- **react-dom** `^18 || ^19`
- **react-aria-components** `>=1`

## Styles

Each styled package exposes a `styles.css`. Import them **once**, at your app entry, in layer order — tokens first, then primitives, then patterns:

```ts
import "@fractalui/tokens/styles.css";
import "@fractalui/primitives/styles.css";
import "@fractalui/patterns/styles.css"; // only if you use patterns
```

Styling is [vanilla-extract](https://vanilla-extract.style/) — zero-runtime CSS extracted at build time, so these are static stylesheets with no runtime cost.

→ Next: [Quickstart](quickstart.md)
