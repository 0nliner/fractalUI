---
name: fractalui-editor-custom-blocks
description: Use when adding, changing, or reviewing custom block types in the fractalUI kit `BlockEditor` (`@fractalui/primitives`) — the `customBlocks` plugin API (`CustomBlockDef`: render + edit + icon in the «/» menu, data in `block.data`). Trigger on any work with `<BlockEditor customBlocks=…>`, `CustomBlockDef`, `EditorBlock.data`, a new block type inside a KB/document node, or migrating an app-side block widget into the editor. Read `fractalui-architecture` and `fractalui-ux` first.
---

# fractalUI — кастомные блоки `BlockEditor` (`customBlocks`)

`BlockEditor` из `@fractalui/primitives` умеет **типы блоков приложения** без правки ядра: приложение объявляет `CustomBlockDef` (рендер + правка + иконка в меню «/» + начальные данные), передаёт их пропом `customBlocks`, а данные блока живут в `block.data`. Слой **L1**: кит рисует хром документа и диспетчеризует по `type`, но доменного блока не знает — его целиком рисует `render` приложения. Без сети и стора.

> `<Name>` — PascalCase, `<name>` — kebab/camel. Кастом-тип — произвольная строка (`'task_params'`, `'callout'`), не пересекающаяся со встроенными.

Не форкай ядро редактора и не рисуй блок сбоку от документа. Нужен свой блок в документе — объяви `CustomBlockDef`. Диспетчер типов, меню «/», drag/выделение/сохранение лишних полей — всё это кит уже делает; повторять запрещено.

## 1. Быстрый старт

Объяви `CustomBlockDef`, передай в `customBlocks` — пункт появится в меню «/» после встроенных, а блок с этим `type` будет рисоваться твоим `render`.

```tsx
import { BlockEditor, type CustomBlockDef, type EditorBlock } from '@fractalui/primitives';

type Params = { status: string; due: string | null };
const read = (b: EditorBlock): Params => {
  const d = (b.data ?? {}) as Partial<Params>;
  return { status: d.status ?? 'backlog', due: d.due ?? null };
};

const taskParams: CustomBlockDef = {
  type: 'task_params',
  label: 'Параметры задачи',
  icon: <ListChecks size={15} />,               // иконку приносит приложение (lucide)
  defaultData: () => ({ data: { status: 'backlog', due: null } }),
  render: ({ block, onChange, isEditing, readOnly }) => {
    const p = read(block);
    const editable = isEditing && !readOnly;
    return editable
      ? <StatusSelect value={p.status} onChange={(status) => onChange({ data: { ...block.data, status } })} />
      : <StatusBadge value={p.status} />;
  },
};

<BlockEditor value={blocks} onChange={setBlocks} customBlocks={[taskParams]} />
```

`customBlocks` не задан → всё как раньше: ни пункта в меню, ни своей ветки диспетчера (полная обратная совместимость).

## 2. `CustomBlockDef` — контракт

```ts
export interface CustomBlockDef {
  type: string;                                   // значение block.type, за которое отвечает плагин
  label: string;                                  // подпись пункта в меню «/»
  description?: string;                           // второстепенная подпись (как «LaTeX» у формулы)
  icon?: ReactNode;                               // иконка пункта меню (кит библиотеку иконок не тянет)
  defaultData?: () => Partial<EditorBlock>;       // начальные поля при вставке/смене типа — обычно { data: {...} }
  render: (p: CustomBlockRenderProps) => ReactNode;
}
export interface CustomBlockRenderProps {
  block: EditorBlock;                             // читай block.data / block.content
  onChange: (patch: Partial<EditorBlock>) => void;// пиши правку: onChange({ data: { ...block.data, ... } })
  isEditing: boolean;                             // блок в фокусе И документ редактируемый
  readOnly?: boolean;                             // документ только для чтения
}
```

- **Данные — в `block.data`** (`Record<string, unknown>`). Ядро их не интерпретирует, только сохраняет losslessly. Читай через хелпер с дефолтами (`read(block)`), пиши мержем: `onChange({ data: { ...block.data, field } })` — не затирай соседние поля.
- **`defaultData()`** сидит блок при вставке из «/» и при смене типа на кастом. Возвращает `Partial<EditorBlock>` — обычно `{ data: {...} }`; кит сам проставит `id`/`type`/`indent`.
- **`render`** рисует и просмотр, и правку — режим по `isEditing`/`readOnly`. Это не текстовый блок: свой UI (селекты, даты, чипы), клавиатуру документа не подключаешь — как `divider`/`table`.
- **`icon`** приносит приложение (наш набор — lucide-react), в одном стиле со встроенными (`size={15}`).

## 3. Что кит делает сам

- **Диспетчеризация:** `BlockRow` рисует известные типы своим `switch`, неизвестный `type` ищет в `customBlocks` и отдаёт `render`. Не нашёл (чужой документ, плагин не подключён) — рисует как абзац, блок не теряется.
- **Меню «/» и «Изменить тип»:** пункты `customBlocks` дописываются после встроенных (иконка/подпись из дефа). Выбор пункта = смена/вставка типа с сидом `defaultData()`.
- **Drag, выделение, дублирование, удаление, копирование** блока — общий хром строки, кастом-блок в нём участвует как все.
- **Сохранение:** лишние поля блока (в т.ч. `data`) переживают round-trip (спреды в редакторе). `onChange` из `render` коммитит через общий `handleUpdate`.
- **`type`** блока — `BlockType = EditorBlockType | (string & {})`: автодополнение по встроенным + любые свои строки.

## 4. Границы слоя

Кастом-блоки остаются **primitive-grade** (L1), пока:

- рендер и данные приходят пропсами (`customBlocks`, `block.data`), кит не знает, что такое «параметры задачи» или «callout»;
- домен, сеть, SDK, стор — в приложении: `render` — презентационный, дёргает `onChange`, а загрузку/сохранение узла делает обёртка приложения (напр. `KbBlockEditor`);
- импорты примитива — только `@fractalui/tokens` (+ React/React-Aria).

Кастом-блок с сетью/схемой (загрузка справочника исполнителей, schema-driven форма внутри) — это уже L2: делай сам блок тонким (данные из `block.data`), а тяжёлое подавай в `render` через колбэки приложения. Не тащи домен в примитив.

## 5. Добавить/изменить

Со стороны **приложения** — только объявить `CustomBlockDef` и передать в `customBlocks`. Ядро кита трогать не нужно.

Если правишь **сам механизм** (`packages/primitives/src/Editor/`): типы в `types.ts` (`CustomBlockDef`, `BlockType`, `EditorBlock.data`), проброс в `context.tsx`/`BlockEditor.tsx` (`config.customBlocks` + сид в `handleAdd`/`handleChangeType`), диспетчер — `default`-ветка `renderBlock()` в `BlockRow.tsx`, пункты меню — `CommandMenu` в `menus.tsx`. Всё аддитивно: без `customBlocks` поведение прежнее (потребители `BlockEditor` не ломаются).

Стили кастом-блока — только `vars.*` (`fractalui-architecture` §5), иконки — пропсами.

## Чеклист

- [ ] Не форкал ядро и не рисовал блок вне документа — объявил `CustomBlockDef`, передал в `customBlocks`.
- [ ] Данные в `block.data`; чтение — хелпер с дефолтами, запись — мерж `{ ...block.data, ... }`.
- [ ] `defaultData()` сидит блок; `render` учитывает `isEditing`/`readOnly`.
- [ ] `type` не пересекается со встроенными; `customBlocks` не задан → ноль изменений (обратная совместимость).
- [ ] Стили из `vars.*`, иконка — пропсом; импорты примитива не выше `@fractalui/tokens`.
- [ ] `pnpm --filter @fractalui/primitives typecheck && lint && build` зелёные; история в Storybook (`Components/BlockEditor` → `CustomBlock`); потребитель `BlockEditor` (game_heart `DocEditor`) типизируется.
