---
name: fractalui-editor-layout
description: Use when adding, changing, or reviewing the tile/layout mode of the fractalUI kit `BlockEditor` (`@fractalui/primitives`) — the 12-column grid (`layout` prop, `BlockLayout` = colSpan/rowSpan/colStart/rowStart), Android-style resize handles, the «Размер плитки» right-click menu, and the fullscreen `toolbar`. Trigger on any work with `<BlockEditor layout>`, `BlockLayout`, `block.layout`, `LayoutHandles`, tile resize/positioning, responsive collapse of the editor grid, or rendering a page layout read-only on a public site. Read `fractalui-architecture`, `fractalui-editor-custom-blocks` and `fractalui-ux` first.
---

# fractalUI — плитки/лейаут в `BlockEditor`

`BlockEditor` из `@fractalui/primitives` умеет **режим плиток**: с пропом `layout` блоки раскладываются по **12-колоночной CSS-сетке**, каждый несёт геометрию `block.layout` (`colSpan/rowSpan/colStart/rowStart`), выбранная плитка получает **primary-контур + круглые ручки на центрах граней** (ресайз в стиле «нового Android»), а ПКМ даёт меню **«Размер плитки»** с пресетами. Без пропа `layout` — обычный линейный редактор (полная обратная совместимость). Геометрия рендерится **идентично в edit и readOnly**, поэтому публичный сайт показывает тот же лейаут через `readOnly`.

> `<Name>` — PascalCase, `<name>` — kebab/camel. Плитка = блок с `layout`.

Не изобретай свой грид/ресайз вокруг редактора. Нужны плитки — включи `layout`. Сетка, снап к колонкам, ручки, ПКМ-меню, фуллскрин, отзывчивость и readOnly-паритет — это уже в ките.

## 1. Быстрый старт

```tsx
import { BlockEditor, type EditorBlock } from '@fractalui/primitives';

const blocks: EditorBlock[] = [
  { id: 't', type: 'heading2', content: 'Дашборд', layout: { colSpan: 12 } },
  { id: 'a', type: 'paragraph', content: '…', layout: { colSpan: 4, rowSpan: 2 } },
  { id: 'b', type: 'paragraph', content: '…', layout: { colSpan: 8 } },
];

// Редактирование:
<BlockEditor value={blocks} onChange={setBlocks} layout toolbar />
// Просмотр (публичный сайт) — тот же лейаут, без ручек:
<BlockEditor value={blocks} onChange={() => {}} layout readOnly />
```

Без `layout` — линейный редактор как раньше. `block.layout` без пропа `layout` — игнорируется (байт-в-байт прежнее поведение).

## 2. Модель данных — `BlockLayout`

```ts
export interface BlockLayout {
  colSpan?: number;   // ширина 1–12 (дефолт 12)
  rowSpan?: number;   // высота в рядах ≥1 (дефолт 1)
  colStart?: number;  // стартовая колонка 1–12; нет → авто-поток
  rowStart?: number;  // стартовый ряд; нет → авто-поток
  locked?: boolean;             // «занять область»: размер зафиксирован, ручки скрыты
  scroll?: 'x' | 'y' | 'both';  // контент скроллится внутри rowSpan-области
}
```
Лежит в `EditorBlock.layout`. Значения — **целые ячейки сетки**, не px → лейаут отзывчив и одинаков в readOnly. Персистится losslessly (все мутации редактора — спред). **Дефолт `colSpan:12` auto-flow = обычный текстовый редактор**; уменьшение `colSpan` кладёт плитки в ряд.

**Геометрия отделена от режима (`gridActive`):** сетка применяется, если `layout`-проп включён ИЛИ у любого блока есть `block.layout` (`gridActive = layout || blocks.some(b => b.layout)`). Т.е. **расставленные плитки выглядят одинаково в обычном режиме, layout-режиме и readOnly** — просто без редакторской разметки. Проп `layout` управляет ТОЛЬКО хромом (направляющие/контуры/ручки/тулбар/перемещение/выбор/ПКМ-«Размер плитки»). Документ без единого `block.layout` при `layout=false` = линейный редактор как раньше (game_heart и пр. не затронуты).

## 3. Взаимодействие

- **Ручки** (выбранная плитка, только edit): круглые на центрах граней. Право → `colSpan`, лево → `colStart`+`colSpan` (двигает левый край), низ/верх → `rowSpan`. Шаг **снапится к колонкам/рядам** (шаг колонки считается от ширины grid-контейнера с учётом `column-gap`). Живое превью — в локальном стейте `BlockRow`; коммит `onChange` — **один раз на pointerup**.
- **Направляющие + контуры плиток** (`Editor/BlockEditor.css` `guideOverlay`/`guideCol`, `gridCell[data-tile-peer]`): видны **всё время в layout-режиме** (`layout && !readOnly`, НЕ только при выборе) — 12 dashed-направляющих колонок (accent ~0.35) + СПЛОШНОЙ контур на каждой невыбранной плитке (accent ~0.5 через `color-mix`, чуть ярче гайдов). Выбранная плитка получает свой яркий 2px-контур от `LayoutHandles`. Иерархия: выбранная (2px accent) > плитки (solid ~0.5) > гайды (dashed ~0.35).
- **Тулбар под плиткой** (`Editor/TileToolbar.tsx`, при выборе): горизонтальный ряд иконок с **мгновенными CSS-тултипами** (`data-tip` → `::after` на `:hover`, БЕЗ браузерной задержки native `title`) — **замок** «занять область» (`locked` → ручки скрыты, размер зафиксирован), **прокрутка** (дропдаун осей Выкл/Вертикаль/Горизонталь/Обе → `scroll`), **пресеты ширины** (⅓/½/⅔/вся), **высота ±** (`rowSpan`), **дублировать/удалить**. Клики `stopPropagation` (не сбрасывают выбор).
- **Перемещение (drag-and-drop, как в Android)**: у выбранной плитки в верхнем-левом углу — круглая ручка перемещения (`tileMoveHandle`). Тянешь: по горизонтали живёт `colStart` (снап к колонке, превью), по вертикали — **живой индикатор места вставки** (accent-линия `data-drop` top/bottom на целевой плитке, тот же CSS что HTML5-реордер), на pointerup — коммит `colStart` + переупорядочивание. Цель ищет `findDropTarget` в EditorBody: **БЛИЖАЙШАЯ по 2D-расстоянию плитка** (вертикаль весит ×2), а НЕ «строго под курсором». Это критично: старый `elementsFromPoint` требовал прямого попадания в чужую строку — внутри высокой плитки (большой `rowSpan`), в пустых ячейках сетки и ниже всех блоков цель не находилась → «часть блоков не перемещалась по вертикали». `findDropTarget` скоупится к `rootRef` (контейнеру редактора). Строки несут `data-block-id`; пропы BlockRow — `onReorderToPoint` (коммит) + `onMovePreview` (индикатор).
- **ВАЖНО про высоту:** `gridRoot` обязан быть `align-items: stretch` (НЕ `start`) — иначе плитка «схлопывается» к контенту и `rowSpan` не виден. Направляющие: `guideOverlay` нужен `grid-template-rows: 1fr`, иначе пустые колонки-гайды имеют высоту 0.
- **ПКМ по блоку** → `BlockContextMenu` → сабменю **«Размер плитки»** (те же пресеты, дублирует тулбар для правого клика).
- **`toolbar`** проп → тонкий тулбар редактора с кнопкой **«На весь экран»**: фуллскрин через `createPortal` в `document.body` (НЕ native Fullscreen API). Esc выходит.
- **Прокрутка** (`scroll`): контент оборачивается в `contentScroll` с `max-height = rowSpan × (40px + gap)` (единица ряда = `LayoutHandles.rowStep`) + `overflow` по осям. Двигая нижнюю ручку, меняешь высоту скролл-области. Работает и в readOnly (паритет).
- Выбор плитки — клик в layout-режиме; клик по фону сетки снимает выбор.
- **Авто-включение по drag:** проп `onBlockDragStart?: () => void` вызывается, когда пользователь берёт блок за грип (начало drag). Приложение может включить `layout` (напр. `onBlockDragStart={() => setLayoutMode(true)}` в PAB `KbBlockEditor`) — тогда «взял ручку → сразу режим плиток + плитка выделена». Без пропа грип работает по-старому (линейный реордер); опт-ин, других потребителей не трогает.

## 4. Как это устроено внутри (для правок ядра)

`packages/primitives/src/Editor/`:
- **`types.ts`** — `BlockLayout`, `EditorBlock.layout`.
- **`context.tsx`** — `EditorConfig.layout: boolean` (флаг режима, отдельно от геометрии).
- **`BlockEditor.tsx`** — проп `layout`/`toolbar`; `EditorBody` вешает `gridRoot` на контейнер, держит `selectedTileId`, тулбар + фуллскрин-портал.
- **`BlockRow.tsx`** — на строку вешает класс `gridCell` и пишет CSS-переменные `--tile-col/-col-span/-row/-row-span` из `block.layout`; ПКМ (`onContextMenu`); рендер `LayoutHandles` для выбранной плитки; локальный `preview` для живого ресайза.
- **`LayoutHandles.tsx`** — оверлей: контур + 4 ручки, pointer-capture жест (шаблон `ResizablePanel`), снап-математика.
- **`menus.tsx`** — `LayoutMenu` + пункт «Размер плитки» в `BlockContextMenu`.
- **CSS `BlockEditor.css.ts`** — `gridRoot` (12 колонок, `@media 640px→1fr`), `gridCell`, `tileOverlay`, `tileHandle`, `handleEdge`, `toolbar`, `fullscreenOverlay`.

**Linchpin:** геометрию писать **CSS-переменными**, а НЕ сырым inline `gridColumn` — иначе media-запрос не схлопнет плитки в одну колонку на мобиле (inline перекрывает media). `gridCell` + `!important`-сброс в `@media` решает и отзывчивость, и readOnly-паритет (класс/переменные НЕ гейтятся `!readOnly`, гейтятся только ручки/меню).

## 5. Интеграция в приложении

- **Автосейв не спамить:** ресайз коммитит `onChange` один раз на pointerup — но если ваша обёртка дебаунсит save, всё равно проверьте, что один drag = один save.
- **Сериализаторы/normalize:** любой whitelist полей блока на стороне приложения (`normalize`, `apiFromBlock`, store-тип) ДОЛЖЕН пропускать `layout`, иначе геометрия теряется на round-trip (тот же класс бага, что `url/name/rows/align/data`).
- **Публичный рендер:** показывайте страницы тем же `<BlockEditor readOnly layout>` — лейаут отрисуется идентично. Публичному приложению нужен alias на исходники кита + `dedupe: ['react','react-dom','react-aria-components','@internationalized/date']` + `vanillaExtractPlugin`.
- **Высота:** `gridAutoRows: minmax(40px, auto)` — плитка с большим контентом растёт; `rowSpan` резервирует ≥ rowSpan·40px.

## Чеклист

- [ ] Не рисовал свой грид/ресайз — включил `layout`.
- [ ] Геометрия в `block.layout` (целые ячейки), не px; сериализаторы/normalize пропускают `layout`.
- [ ] `layout` не задан → редактор линейный (обратная совместимость).
- [ ] Публичный сайт рендерит `readOnly layout` тем же `BlockEditor` (паритет).
- [ ] Правил ядро → геометрия только CSS-переменными (media-сброс), не сырым inline `gridColumn`.
- [ ] `pnpm --filter @fractalui/primitives typecheck && lint && build` зелёные; истории `Layout`/`LayoutReadOnly` в Storybook; game_heart `tsc -b` зелёный.
