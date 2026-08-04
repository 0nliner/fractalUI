---
name: fractalui-editor-authoring
description: Use when adding, changing, or reviewing document/page CONTENT authored with the fractalUI kit `BlockEditor` (`@fractalui/primitives`) — the full `EditorBlock` JSON palette per type (`heading`/`paragraph`/`list`/`to_do`/`toggle`/`code`/`quote`/`divider`/`table`/`image`/`page_link`), tile geometry (`layout`), per-block `color`/`bg` + theme safety, and the one-block-per-list-item rule. Trigger on any work building `EditorBlock[]` / a document's JSON blocks, seeding page content, tiles, or block colors. Read `fractalui-editor-layout`, `fractalui-editor-custom-blocks` and `fractalui-ux` first.
---

# fractalUI — авторинг контента `BlockEditor` (`EditorBlock[]`)

`BlockEditor` из `@fractalui/primitives` хранит документ как **плоский JSON-массив `EditorBlock`**. Этот скилл — про то, как СОБРАТЬ такой массив руками (сид, миграция, агент), чтобы страница была структурной и красивой. Механику плиток см. `fractalui-editor-layout`, кастом-типы — `fractalui-editor-custom-blocks`, композицию/дизайн — `fractalui-editor-aesthetics`.

> Один блок = одна запись массива. Вложенность — поле `indent` (0–5), НЕ дерево (исключение — `toggle.children`). Плитка = блок с `layout`. Callout = блок с `bg`.

Не изобретай свой формат разметки и не пиши HTML/markdown в `content` — рендерит только известный тип из §2. Плитки, цвет, таблицы, тогглы уже умеет кит; не городи обёртки вокруг.

## 1. Быстрый старт

Минимальный валидный документ — массив блоков, у каждого `id`, `type`, `content`:

```json
[
  { "id": "b1", "type": "heading1", "content": "Заголовок страницы" },
  { "id": "b2", "type": "paragraph", "content": "Вводный абзац: что это и зачем." },
  { "id": "b3", "type": "bulleted_list", "content": "Первый пункт" },
  { "id": "b4", "type": "bulleted_list", "content": "Второй пункт" }
]
```

```tsx
import { BlockEditor, type EditorBlock } from '@fractalui/primitives';
<BlockEditor value={blocks} onChange={setBlocks} />          // правка
<BlockEditor value={blocks} onChange={() => {}} readOnly />  // просмотр (тот же рендер)
```

`id` — любые уникальные строки (кит генерит `createBlockId()`; при ручной сборке задавай стабильные — `b-1`, `proj-mcpgum-3` — иначе теряется соответствие при round-trip). `content` обязателен даже пустой (`""`).

## 2. Палитра блоков

| `type` | рендерит | ключевые/спец. поля |
|---|---|---|
| `heading1` `heading2` `heading3` | `<h2>` `<h3>` `<h4>` | `content` |
| `paragraph` | `<p>` | `content` (многострочный ок) |
| `quote` | `<blockquote>` | `content` |
| `bulleted_list` `numbered_list` | **ОДИН** маркер `•`/`N.` на блок | `content` (одна строка!) |
| `to_do` | чекбокс | `content`, `checked: boolean` |
| `toggle` | `<details>` | `content` (заголовок), `collapsed`, `children: EditorBlock[]` |
| `code` | `<pre><code>` | `content`, `language` (`python`/`bash`/`json`/`typescript`/…) |
| `divider` | `<hr>` | — (без `content`) |
| `table` | `<table>` | `rows: string[][]` (`rows[0]` = шапка), `align: ('left'\|'center'\|'right'\|null)[]` |
| `image` `file` | картинка / ссылка | `url`, `name` (нужен `onUploadFile` — не сидируется руками) |
| `formula` | KaTeX | `content` (LaTeX; нужен `renderFormula`) |
| `page_link` | внутр. ссылка | `content` (подпись = зеркало title цели), `target_page_id` |
| *кастом* | `CustomBlockDef.render` | `type` = своя строка, данные в `data` (см. `-custom-blocks`) |

Точный JSON для нетривиальных типов:

```json
{ "id":"t","type":"table",
  "rows":[["Слой","Технология"],["Рантайм","Node.js 22"],["БД","Postgres"]],
  "align":["left","left"] }

{ "id":"tg","type":"toggle","content":"Детали","collapsed":true,
  "children":[ {"id":"tg-1","type":"paragraph","content":"Скрытая строка"} ] }

{ "id":"c","type":"code","content":"docker compose up -d","language":"bash" }

{ "id":"td","type":"to_do","content":"Не забыть про миграцию","checked":false }

{ "id":"pl","type":"page_link","content":"Смежный узел","target_page_id":"<uuid>" }
```

## 3. Плитки — `layout` (12-колоночная сетка)

Любой блок можно превратить в плитку, дав `layout` (детали ресайза/UX — `fractalui-editor-layout`):

```ts
interface BlockLayout {
  colSpan?: number;   // ширина 1–12 (дефолт 12)
  rowSpan?: number;   // высота в рядах ≥1 (ряд ≈ 40px)
  colStart?: number;  // стартовая колонка 1–12; нет → авто-поток
  rowStart?: number;  // стартовый ряд; нет → авто-поток
  locked?: boolean;   // фикс размера
  scroll?: 'x' | 'y' | 'both';
}
```

- Значения — **целые ячейки сетки, не px** → отзывчиво и одинаково в readOnly.
- Если хоть у одного блока есть `layout`, **весь документ** рендерится сеткой (`gridActive`); без `layout` — обычная колонка.
- **`<640px` → 1 колонка** в порядке массива: держи массив читаемым линейно.
- **ГЛАВНОЕ правило раскладки — полагайся на авто-поток, задавай ТОЛЬКО `colSpan`.** Ряд авто-растёт под контент (`gridAutoRows: minmax(40px,auto)`, `rowSpan` по умолчанию 1) — текст НЕ переполняется, плитка сама тянется. Пары «рядом» ставь ПОДРЯД в массиве с суммой `colSpan ≤ 12` — авто-поток сам кладёт их в один ряд.
- **НЕ задавай `rowStart` и большой `rowSpan` вручную под текст/таблицу** — они резервируют высоту (ряд ≈40px), и если контент ниже зарезервированного, между блоками появляются **мёртвые зоны** (пустые провалы). `rowSpan>1` нужен ТОЛЬКО для фиксированной высоты плитки со `scroll` (виджет с внутренним скроллом), не для обычного контента.

Двухколоночный ряд (шапка на всю ширину, под ней два блока рядом) — только `colSpan`, порядок делает всё:

```json
[
  { "id":"h","type":"heading2","content":"Дашборд","layout":{"colSpan":12} },
  { "id":"l","type":"paragraph","content":"Левая","layout":{"colSpan":6} },
  { "id":"r","type":"paragraph","content":"Правая","layout":{"colSpan":6} }
]
```

## 4. Цвет — `color` / `bg`

Каждый блок несёт `color` (цвет текста) и `bg` (фон); оба — **любой CSS-цвет** (обычно hex), применяются inline и в edit, и в readOnly. `bg` даёт callout-вид (`borderRadius:6` + padding `4px 8px`).

Пресеты (Open Color, MIT) — бери из них:
- Насыщенные (shade-6, для `color` или яркого `bg`): `#fa5252 #fd7e14 #fab005 #82c91e #40c057 #12b886 #15aabf #228be6 #4c6ef5 #7950f2 #be4bdb #e64980` + `#000000 #495057 #adb5bd #ffffff`.
- Светлые (shade-2, для фона callout-ов): `#ffc9c9 #ffd8a8 #ffec99 #d8f5a2 #b2f2bb #96f2d7 #99e9f2 #a5d8ff #bac8ff #d0bfff #eebefa #fcc2d7` + `#f1f3f5 #dee2e6`.

**Theme-safety (главное правило):** текст без явного `color` наследует цвет темы. Светлый `bg` + дефолтный (в тёмной теме — светлый) текст = **нечитаемо**. Поэтому:

- Светлый `bg` (shade-2) ⇒ **обязателен тёмный `color`** (`#212529` / `#495057`). Тёмный текст на светлом фоне читается в ОБЕИХ темах.
- Насыщенный `bg` (shade-6) ⇒ `color:"#ffffff"`.

```json
{ "id":"ok","type":"paragraph","content":"● Активно","bg":"#b2f2bb","color":"#212529" }
```

Дисциплина цвета (сколько и зачем) — в `fractalui-editor-aesthetics`.

## 5. Инварианты

- **Списки: один пункт = один блок.** Кит рисует один маркер на блок и НЕ сплитит `content` по `\n`. Три пункта = три блока `bulleted_list`. (Некоторые app-хелперы склеивают пункты через `\n` в один блок — это формат для НЕ-kit публичных рендереров; в ките это один пункт с переносами.)
- **Вложенность — `indent` (0–5)**, не дерево. `numbered_list` нумеруется автоматически по соседним блокам того же `indent`.
- **`id` уникальны** в пределах документа.
- **`content: list[Any]` не валидируется по-блочно** на бэке (у большинства потребителей) — лишние поля переживают round-trip, но и мусор не отсекается: клади только известные поля из §2.
- **`image`/`file`** требуют `onUploadFile` — руками (в сиде) не создаются, только через загрузку в редакторе.

## Чеклист

- [ ] Каждый блок — известный `type` из §2; у всех уникальный `id`.
- [ ] Списки: по одному пункту на блок (не склеивал через `\n`).
- [ ] Плитки: `layout` в целых ячейках; массив читается линейно (схлопывание `<640px`).
- [ ] Любой светлый `bg` имеет тёмный `color`; насыщенный `bg` — `color:#ffffff`.
- [ ] **Открыл документ в `BlockEditor` (edit и readOnly) — все блоки отрисовались, ничего не выпало и не налезает.**
