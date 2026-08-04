---
name: fractalui-new-slice
description: Use when adding a new unit to the fractalUI kit — a primitive component, a schema-driven pattern, a new package, or when migrating a legacy src/ component into the new layered structure. Gives the step-by-step recipe and file skeletons for placing it in the correct technical layer (tokens/primitives/patterns/runtime/data), laying it out in FSD segments (ui/model/lib/api/config), wiring its public index.ts, css.ts (vanilla-extract), Storybook story, and respecting the one-way dependency rule and headless stack. Trigger on "add a component", "add a pattern/factory", "create a package", "scaffold", or "migrate <X> from src/".
---

# fractalUI — добавление нового слайса/пакета

Рецепт «как завести новый кусок по архитектуре». Сначала прочитай
`fractalui-architecture` (слои, правила, стек). Здесь — пошаговая механика.

> `<Name>` — PascalCase, `<name>` — kebab/camel, `<pkg>` — целевой пакет.

## Шаг 0. Определить слой (это решает всё остальное)

Задай вопрос «что это делает с данными?»:

| Если оно… | Слой / пакет |
|---|---|
| просто рисует, данные из props, без сети и стора | **primitives** (`@fractalui/primitives`) |
| строит UI из схемы (форма/таблица/фид), данные через props/render-props | **patterns** (`@fractalui/patterns`) |
| оркеструет страницу/конфиг/auth, тянет данные | **runtime** (`@fractalui/runtime`) |
| токен/тема | **tokens** (`@fractalui/tokens`) |
| обёртка SDK / стор | **data** (`@fractalui/data`) |

Сомневаешься между primitives и patterns → если завязано на JSON-схему/OpenAPI,
это **patterns**; если нет — **primitives**.

## Шаг 1. Скелет слайса (FSD-сегменты)

```
packages/<pkg>/src/<Name>/
  index.ts          // public API: export { <Name> } from './ui/<Name>'; export type { <Name>Props }
  ui/
    <Name>.tsx      // презентация; пропсы = <Name>Props
    <Name>.css.ts   // vanilla-extract стили на токенах @fractalui/tokens
    <Name>.stories.tsx
  model/            // (опц.) хуки/стор — только если есть состояние
  lib/              // (опц.) чистые утилиты/мапперы
  api/              // (опц.) типы контрактов данных (без конкретного SDK на L1/L2)
  config/           // (опц.) дефолты/варианты
```

Заводи только нужные сегменты. Но **не сваливай** рендер + состояние + доступ к
данным в один файл.

## Шаг 2. Шаблон компонента

```tsx
// ui/<Name>.tsx
import * as styles from './<Name>.css';

export type <Name>Props = {
  // явные типизированные пропсы; данные и колбэки приходят сюда, не из стора
};

export function <Name>(props: <Name>Props) {
  return <div className={styles.root}>{/* ... */}</div>;
}
```

```ts
// ui/<Name>.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  // только токены: vars.color.*, vars.space.*, vars.radius.* — НЕ хардкод
});
```

```ts
// index.ts
export { <Name> } from './ui/<Name>';
export type { <Name>Props } from './ui/<Name>';
```

Затем добавь реэкспорт в корневой `packages/<pkg>/src/index.ts`.

## Шаг 3. Правила, которые легко нарушить

- **Зависимости только вниз по слоям.** primitives не импортируют patterns/data;
  patterns не импортируют hey-api/Zustand.
- **Headless-стек:** React Aria для интерактива, TanStack Table для таблиц,
  RHF+AJV для форм. Никакого MUI/RJSF/MRT/Recoil.
- **Никаких** инлайн-стилей с хардкодом, `any`, `@ts-ignore`, `console.log`.
- Наружу — только через `index.ts`.

## Шаг 4. Storybook

Каждый primitive/pattern получает `*.stories.tsx` с моковыми данными — паттерн
обязан рендериться **без сети**. Если для истории нужен бэкенд — слайс лежит не на
том слое (подними данные в пропсы).

## Новый пакет

1. `packages/<pkg>/` с `package.json` (`name: @fractalui/<pkg>`, `type: module`,
   `exports` на `dist`), `tsconfig.json` (extends корневой, `strict: true`),
   сборка через **tsup** (ESM + dts).
2. Объяви разрешённые зависимости по таблице слоёв; добавь в ESLint-boundaries.
3. `src/index.ts` как единственный публичный вход.
4. Подключи к Turborepo pipeline (build/lint/test).

## Миграция легаси из `src/`

1. Определи слой (Шаг 0) — старый файл часто мешал несколько слоёв сразу, **разрежь**.
2. Перенеси презентацию в `ui/`, состояние в `model/`, утилиты/мапперы в `lib/`,
   типы в `api/`.
3. Замени легаси-зависимость на headless-аналог (MUI→React Aria, MRT→TanStack
   Table, RJSF→RHF+AJV, Recoil→Zustand/TanStack Query).
4. Затипизируй строго, убери `@ts-ignore`/`console.log`/мёртвый код.
5. Добавь story. Удали исходный файл из `src/` после переноса.
