---
title: fractalUI
---

<div class="fui-banner">
  <div class="fui-banner-glow"></div>
  <div class="fui-banner-icon">
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#9d8bff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <rect x="14" y="10" width="36" height="12" rx="3"/>
        <rect x="12" y="42" width="16" height="12" rx="3"/>
        <rect x="36" y="42" width="16" height="12" rx="3"/>
        <path d="M32 22v6M20 42v-6h24v6"/>
      </g>
    </svg>
  </div>
  <div>
    <div class="fui-banner-title">fractalUI</div>
    <div class="fui-banner-tagline">
      Layered like a system.<br>
      Headless like clay.<br>
      Composed like Lego.
    </div>
  </div>
</div>

<p class="fui-credit">developed by <a href="https://github.com/0nliner" target="_blank">Чудайкин Александр</a> · <a href="https://github.com/0nliner" target="_blank">Бюро автоматизации процессов</a></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@fractalui/primitives"><img alt="npm" src="https://img.shields.io/npm/v/@fractalui/primitives?color=6d5efc&label=%40fractalui%2Fprimitives"></a>
  <a href="https://github.com/0nliner/easyUI/blob/main/LICENSE"><img alt="MIT" src="https://img.shields.io/badge/license-MIT-6d5efc"></a>
  <a href="https://reactjs.org"><img alt="React" src="https://img.shields.io/badge/React-18%20%7C%2019-6d5efc"></a>
</p>

---

**fractalUI** is a layered, headless React UI-kit with a config-driven runtime on top. You get accessible primitives you fully control, composed patterns for whole app shells, and — when you want it — a renderer that builds screens from plain config. Pick the layer that fits; ignore the rest.

## Who are you?

=== "Product engineer"

    You ship features, not buttons. fractalUI hands you accessible primitives (built on React Aria) and ready patterns — an app shell, resizable docks, tables, tree, a block editor — so a whole admin panel is composition, not a rewrite. Style with design tokens, not one-off CSS.

=== "Design-system owner"

    One set of tokens (`@fractalui/tokens`, vanilla-extract) drives every component. Change density or brand by overriding tokens — not by forking components. The kit is headless, so your look is yours; the behavior and a11y come for free.

=== "Platform / low-code"

    `@fractalui/runtime` turns config into screens. Describe a page as data, render it with the kit. Great for internal tools, generated admin UIs, and anything where the layout is data, not hand-written JSX.

## Install

```bash
npm i @fractalui/primitives @fractalui/tokens
```

```tsx
import "@fractalui/tokens/styles.css";
import "@fractalui/primitives/styles.css";
import { Button } from "@fractalui/primitives";

export function App() {
  return <Button onPress={() => alert("hi")}>Click me</Button>;
}
```

→ [Full quickstart](guide/quickstart.md)

## The layers

fractalUI is a stack — each layer builds on the ones below, and each is a separate npm package you can adopt independently.

<div class="fui-layers">
  <div class="fui-layer"><b>@fractalui/tokens</b> — <span>design tokens (vanilla-extract): color, space, radius, typography, density</span></div>
  <div class="fui-layer"><b>@fractalui/icons</b> — <span>the icon set</span></div>
  <div class="fui-layer"><b>@fractalui/primitives</b> — <span>headless, accessible React components (Button, Drawer, Table, Tree, DatePicker, BlockEditor…)</span></div>
  <div class="fui-layer"><b>@fractalui/patterns</b> — <span>composed patterns: AppShell, DockPanel, ResizablePanel, AgentChat</span></div>
  <div class="fui-layer"><b>@fractalui/runtime</b> — <span>config-driven renderer — screens from data</span></div>
  <div class="fui-layer"><b>@fractalui/data</b> — <span>data utilities shared by the runtime</span></div>
</div>

→ [How the layers fit together](guide/architecture.md)

## Why fractalUI

- **Headless, but batteries-included.** You own the markup and the look; accessibility, keyboard behavior, and focus management come from [React Aria](https://react-spectrum.adobe.com/react-aria/).
- **Tokens, not overrides.** Density and brand are token changes, not component forks. Styling is [vanilla-extract](https://vanilla-extract.style/) `.css.ts` — typed, zero-runtime.
- **Adopt one layer or all of them.** Take just the tokens, just the primitives, or the whole runtime. Nothing forces the full stack.
- **Config-driven when you want it.** The runtime renders screens from plain config — handy for generated and low-code UIs.

## License

MIT © Aleksandr Chudaikin · [source on GitHub](https://github.com/0nliner/easyUI)
