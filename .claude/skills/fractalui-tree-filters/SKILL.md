---
name: fractalui-tree-filters
description: Use when adding, changing, or reviewing filtering on the fractalUI kit `Tree` (`@fractalui/primitives`) — the built-in faceted filter (иконка справа от поиска → панель под ним, chips/tags/toggle, prune с сохранением предков). Trigger on any work with `<Tree facets=…>`, `TreeFacet`, `TreeNode.data`, filtering/facets/тэги/тип объекта in a tree, adding a new facet kind, or migrating an app-side tree filter into the kit. Read `fractalui-architecture` and `fractalui-new-slice` first.
---

# fractalUI — фасетный фильтр дерева (`Tree`)

`Tree` из `@fractalui/primitives` умеет **встроенный фасетный фильтр**: кнопка-иконка справа от строки поиска раскрывает панель под ней с пилюлями/тегами; узлы прунятся в памяти с сохранением предков совпадений. Слой **L1**: кит рисует UI и фильтрует переданные `nodes`, но домена не знает — значения читаются колбэком `get` из `node.data`. Без сети и стора.

> `<Name>` — PascalCase, `<name>` — kebab/camel, `<D>` — доменная модель узла.

Не изобретай фильтр в приложении. Если тебе нужен фильтр дерева — объяви `facets`. Ручной фильтр вокруг `Tree` (панель + prune + авто-раскрытие) — это то, что кит уже делает; повторять запрещено.

## 1. Быстрый старт

Положи доменный объект в `node.data`, объяви `facets` — всё остальное (иконка, панель, prune, авто-раскрытие совпадений, блокировка DnD на время фильтра) делает кит.

```tsx
import { Tree, type TreeFacet, type TreeNode } from '@fractalui/primitives';

type Item = { id: string; title: string; type: string; tags: string[]; starred: boolean; children?: Item[] };

const toNode = (n: Item): TreeNode => ({
  id: n.id,
  label: n.title,
  data: n,                       // ← из него читают facets
  children: n.children?.map(toNode),
  icon: <TypeIcon type={n.type} />,
});

const d = (n: TreeNode) => n.data as Item;   // единый кастинг в предикатах
const facets: TreeFacet[] = [
  { id: 'starred', kind: 'toggle', label: 'Избранные', icon: <Star size={11} />, get: (n) => d(n).starred },
  { id: 'type',    kind: 'chips',  get: (n) => d(n).type,
    options: TYPES.map((t) => ({ value: t.value, label: t.label, icon: <t.icon size={11} /> })) },
  { id: 'tags',    kind: 'tags',   placeholder: '+ тег', get: (n) => d(n).tags },
];

<Tree nodes={items.map(toNode)} searchable facets={facets} filterIcon={<SlidersHorizontal size={14} />}
      selectedId={sel} onSelect={(n) => setSel(n.id)}
      expandedIds={exp} onExpandedChange={setExp} onDrop={onDrop} onRename={onRename} />
```

`facets` не задан → фильтра нет, ни грамма chrome не рисуется, `nodes` не прунятся (полная обратная совместимость с деревьями без фильтра).

## 2. Три вида фасетов

Каждый фасет читает значение узла через `get: (node: TreeNode) => …` (внутри кастуешь `node.data`). Между фасетами — **И**, внутри мультивыбора — **ИЛИ**. Пустой выбор фасета = «пропускает всех».

| kind | Что рисует | `get` возвращает | Матч |
|---|---|---|---|
| `toggle` | одна пилюля (`icon` + `label`) | `boolean` | активен → узел, где `get === matchValue` (по умолч. `true`) |
| `chips` | пилюля на каждый `options[]` (`icon`+`label`) | `string \| string[] \| null` | значение узла пересекается с выбранными |
| `tags` | инпут «+ тег» с автоподсказками + чипы выбранных | `string[]` | `match: 'any'` (по умолч.) — хотя бы один; `'all'` — все выбранные |

```ts
export type TreeToggleFacet = { id; label?; kind: 'toggle'; icon?; get: (n: TreeNode) => boolean; matchValue?: boolean };
export type TreeChipsFacet  = { id; label?; kind: 'chips';  options: { value; label; icon? }[]; get: (n: TreeNode) => string | string[] | null | undefined };
export type TreeTagsFacet   = { id; label?; kind: 'tags';   placeholder?; match?: 'any' | 'all'; get: (n: TreeNode) => string[] };
export type TreeFacet = TreeToggleFacet | TreeChipsFacet | TreeTagsFacet;
```

`label` у `toggle` — текст самой пилюли; у `chips`/`tags` (если задан) рисуется **подписью группы** над контролами (напр. «Тип объекта», «Теги»), чтобы набор пилюль читался. `toggle`-фасеты собираются в один компактный ряд без подписей (как в imprint).

Автоподсказки `tags` кит собирает сам — уникальные значения `get()` по всему дереву, отсортированные, минус уже выбранные. Отдельного пропа не нужно.

## 3. Что кит делает сам

- **UX (правка по референсу imprint):** иконка-фильтр (`filterIcon`, дефолт — воронка) стоит **справа от поиска**, панель раскрывается **под строкой поиска**. Кнопка подсвечивается, когда фильтр активен.
- **Prune с предками:** ветвь остаётся, если совпал сам узел ИЛИ выжил потомок — путь до находки виден. Тот же приём, что во встроенном поиске (`filterTree`).
- **Авто-раскрытие:** при активном поиске ИЛИ фильтре все выжившие узлы раскрыты; личное состояние раскрытия (`expandedIds`) не трогается и возвращается при сбросе.
- **Блокировка DnD:** пока фильтр активен, `onDrop` внутренне подавляется (перетаскивание по срезу неоднозначно). Снял фильтр — DnD снова работает.
- **Сброс:** крестик в панели (виден, только когда фильтр активен) чистит все фасеты **и** строку поиска.
- **Состояние — внутреннее** (как и `query` поиска). Наружу не торчит; потребитель только объявляет `facets`.

## 4. Данные узла (`node.data`)

`TreeNode.data?: unknown` — доменный объект. Фасеты читают из него; кит его не интерпретирует. Кастуй в одном хелпере (`const d = (n) => n.data as Item`), а не в каждом `get` — так один источник правды по типу. Строку в дереве по-прежнему рисуют `label`/`icon`/`meta`; фильтр и рендер не связаны.

## 5. Добавить новый вид фасета

Всё в `packages/primitives/src/Tree/Tree.tsx` (+ стили в `Tree.css.ts`). Три точки:

1. **Тип** — добавь вариант в `TreeFacet` (дискриминант `kind`), экспортируется автоматически (`export * from './Tree/Tree'`).
2. **Предикат** — ветку в `facetMatch(f, node, sel)` (пустой `sel` → `true`) и учёт «активности» в `facetsActive`.
3. **Рендер** — ветку в панели фильтров (пилюли или свой контрол), состояние — в `facetState` (`boolean | string[]`), сеттеры рядом (`toggleFacet`/`toggleChip`/`addFacetTag`).

Стили — только через `vars.*` (`facetPill`, `tagInput`, `suggest`, …), инлайн-хардкод цвета/отступа запрещён (`fractalui-architecture` §5). Иконки кит не тянет — приходят пропсами (`filterIcon`, `facet.icon`, `option.icon`); дефолты рисуй встроенным `<svg stroke="currentColor">`, как `DEFAULT_FILTER_ICON`.

## 6. Границы слоя

Фасеты остаются **primitive-grade** (можно в L1, рядом с `searchable`), пока:
- данные и предикаты приходят пропсами (`facets`, `get`), кит не знает, что такое «тип КП» или «starred»;
- состояние — локальный `useState`, как поиск/раскрытие/выбор;
- импорты — только `@fractalui/tokens` (+ React/React-Aria), никакого `patterns`/`runtime`/`data`, сети, SDK, стора.

Если требуется **схемно-управляемое** фасетирование, загрузка фасетов с бэка или композиция по OpenAPI — это L2 `patterns` (как `AutoTable`/`AutoForm`): делай обёртку-паттерн поверх L1 `Tree`, а не тащи домен в примитив.

## Чеклист

- [ ] Не рисовал ручной фильтр вокруг `Tree` — объявил `facets`.
- [ ] Доменный объект в `node.data`; в предикатах один хелпер-кастинг.
- [ ] Пустой выбор фасета пропускает всех; между фасетами И, внутри — ИЛИ.
- [ ] `facets` не задан → ноль chrome и никакого prune (обратная совместимость).
- [ ] Новый вид фасета: тип + `facetMatch` + рендер + `facetsActive`.
- [ ] Стили из `vars.*`, иконки — пропсами; импорты не выше `@fractalui/tokens`.
- [ ] `pnpm --filter @fractalui/primitives typecheck && lint && build` зелёные; история в Storybook (`Components/Tree`).
