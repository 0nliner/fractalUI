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
      Слоистый, как система.<br>
      Headless, как глина.<br>
      Собирается, как Lego.
    </div>
  </div>
</div>

<p class="fui-credit">автор: <a href="https://github.com/0nliner" target="_blank">Чудайкин Александр</a> · <a href="https://github.com/0nliner" target="_blank">Бюро автоматизации процессов</a></p>

---

**fractalUI** — слоистый headless React UI-кит с config-driven рантаймом сверху. Доступные примитивы, которыми вы полностью управляете; готовые паттерны для целого app-shell; и — когда нужно — рендерер, собирающий экраны из обычного конфига. Берите слой, который подходит; остальное игнорируйте.

## Кто вы?

=== "Продуктовый инженер"

    Вы пилите фичи, а не кнопки. fractalUI даёт доступные примитивы (на React Aria) и готовые паттерны — app-shell, растягиваемые доки, таблицы, дерево, блочный редактор — так что целая админка становится композицией, а не переписыванием. Стилизация токенами, а не разовым CSS.

=== "Владелец дизайн-системы"

    Один набор токенов (`@fractalui/tokens`, vanilla-extract) управляет всеми компонентами. Меняете плотность или бренд переопределением токенов — не форком компонентов. Кит headless, поэтому внешний вид ваш; поведение и a11y — из коробки.

=== "Платформа / low-code"

    `@fractalui/runtime` превращает конфиг в экраны. Описываете страницу как данные — рендерите китом. Идеально для внутренних инструментов и генерируемых админок, где раскладка — это данные, а не рукописный JSX.

## Установка

```bash
npm i @fractalui/primitives @fractalui/tokens
```

```tsx
import "@fractalui/tokens/styles.css";
import "@fractalui/primitives/styles.css";
import { Button } from "@fractalui/primitives";

export function App() {
  return <Button onPress={() => alert("привет")}>Нажми</Button>;
}
```

→ [Полный быстрый старт](guide/quickstart.md)

## Слои

fractalUI — это стек: каждый слой стоит на нижних, и каждый — отдельный npm-пакет, который можно подключить независимо.

<div class="fui-layers">
  <div class="fui-layer"><b>@fractalui/tokens</b> — <span>дизайн-токены (vanilla-extract): цвет, отступы, радиусы, типографика, плотность</span></div>
  <div class="fui-layer"><b>@fractalui/icons</b> — <span>набор иконок</span></div>
  <div class="fui-layer"><b>@fractalui/primitives</b> — <span>headless доступные React-компоненты (Button, Drawer, Table, Tree, DatePicker, BlockEditor…)</span></div>
  <div class="fui-layer"><b>@fractalui/patterns</b> — <span>составные паттерны: AppShell, DockPanel, ResizablePanel, AgentChat</span></div>
  <div class="fui-layer"><b>@fractalui/runtime</b> — <span>config-driven рендерер — экраны из данных</span></div>
  <div class="fui-layer"><b>@fractalui/data</b> — <span>утилиты данных для рантайма</span></div>
</div>

→ [Как слои сочетаются](guide/architecture.md)

## Почему fractalUI

- **Headless, но «с батарейками».** Разметка и вид — ваши; доступность, клавиатура и фокус — из [React Aria](https://react-spectrum.adobe.com/react-aria/).
- **Токены, а не переопределения.** Плотность и бренд — это смена токенов, а не форк компонентов. Стилизация — [vanilla-extract](https://vanilla-extract.style/) `.css.ts`: типизированная, zero-runtime.
- **Один слой или все сразу.** Возьмите только токены, только примитивы или весь рантайм. Полный стек не навязывается.
- **Config-driven, когда нужно.** Рантайм рендерит экраны из конфига — удобно для генерируемых и low-code интерфейсов.

## Лицензия

MIT © Aleksandr Chudaikin · [исходники на GitHub](https://github.com/0nliner/fractalUI)
