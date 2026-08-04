---
name: fractalui-architecture
description: Use when writing, reviewing, or refactoring any code in the fractalUI repo (a layered headless UI-kit + config-driven framework). Covers the L0–L3 technical-layer model (tokens → primitives → patterns → runtime) and its one-way dependency rule, the headless stack (vanilla-extract, React Aria Components, TanStack Table, React Hook Form + AJV, hey-api + Zustand) that replaces the legacy MUI/RJSF/material-react-table/Recoil stack, the FSD mapping (kit packages = FSD `shared`; apps = full FSD; slices use ui/model/lib/api/config segments), monorepo conventions (pnpm workspaces + Turborepo + tsup), strict-TypeScript rules, and the legacy anti-patterns to avoid or migrate. Trigger on any work in packages/* or apps/*, adding/moving a component or pattern, touching data/state code, reviewing a diff for architectural style, or migrating legacy src/ code into the new structure.
---

# fractalUI — архитектурный стиль

Правила и шаблоны для агента, пишущего код в fractalUI. Цель — держать **слоистую
headless-архитектуру** и не тащить легаси-привычки из старого `src/`.

> Плейсхолдеры: `<Name>` — PascalCase имя (компонент/слайс), `<name>` — kebab/camel.

## 0. Контекст: легаси vs целевое

Старый код в [`src/`](../../../src/) — это **легаси на миграции**: Recoil, MUI,
RJSF, `@ts-ignore`, рендер+состояние+данные в одном файле. **Не используй его как
образец.** Новый код — строго по правилам ниже. Старое трогаем только в рамках
запланированных фаз миграции.

## 1. Технические слои и правило зависимостей

```
tokens (L0) ← primitives (L1) ← patterns (L2) ← runtime (L3)
                                      ↑
                                  data (служебный: hey-api + Zustand)
```

Импорт **только вниз по стрелке**. Никогда наоборот и никогда «вбок» в чужой
внутренний модуль.

| Слой | Пакет | Можно зависеть от | Нельзя |
|---|---|---|---|
| L0 tokens | `@fractalui/tokens` | — (только vanilla-extract) | React, сеть, стор |
| L1 primitives | `@fractalui/primitives` | tokens, React Aria | сеть, стор, hey-api, бизнес-данные |
| L2 patterns | `@fractalui/patterns` | primitives, tokens | hey-api, глобальный стор, конкретный SDK |
| L3 runtime | `@fractalui/runtime` | patterns, primitives, tokens, data | — |
| data | `@fractalui/data` | hey-api, Zustand, tokens | primitives/patterns/runtime |

Контрольные вопросы перед коммитом:
- **primitives** ничего не знают о данных приложения и не делают запросов. Данные
  приходят через props.
- **patterns** schema-driven, но данные и колбэки получают через **props или
  render-props**, а не из стора/SDK. Паттерн можно отрендерить в Storybook с
  моковыми данными, без сети.
- Завязка на hey-api/Zustand живёт **только** в `data` и `runtime`.

Если тянет импортировать вверх по слою — это сигнал, что обязанность лежит не там.
Подними данные/колбэк в пропсы, а не зависимость в импорты.

## 2. Headless-стек (что использовать)

| Назначение | Используем | НЕ используем (легаси) |
|---|---|---|
| Токены/темы | vanilla-extract | emotion-инлайн, MUI theme |
| Примитивы/a11y | React Aria Components | `@mui/material` |
| Таблицы | TanStack Table | `material-react-table` |
| Формы из JSON-схемы | React Hook Form + AJV | `@rjsf/*` |
| Дата-пикеры | React Aria DatePicker | `@mui/x-date-pickers` |
| Server-state | hey-api SDK (+ опц. `@tanstack/react-query` плагин) | ручной fetch в компонентах |
| UI-state | Zustand | Recoil, Redux, recoil-атомы по md5 |

hey-api генерит **типизированный клиент** (настраивается через конфиг
openapi-ts). TanStack Query плагин — надстройка над этим клиентом для
кэша/пагинации/инвалидации, **не** альтернативный генератор клиента. Он
опционален: база = hey-api + Zustand.

## 3. FSD

- **Пакеты кита — это слой `shared` из FSD**, разнесённый по L0–L3. У кита нет
  pages/widgets/features/entities — он domain-agnostic.
- **apps/** — полноценный FSD (`app/pages/widgets/features/entities/shared`), роль
  `shared/ui` играют `@fractalui/*`.
- Внутри **слайса** (компонента/паттерна) — FSD-сегменты:

```
<Name>/
  index.ts          публичный API слайса (только то, что экспортируется наружу)
  ui/               презентация (.tsx) + .css.ts (vanilla-extract)
  model/            состояние, хуки, zustand-сторы (где уместно)
  lib/              чистые утилиты, мапперы схем
  api/              контракты данных (типы), БЕЗ конкретного SDK на L1/L2
  config/           константы, варианты, дефолты
```

Не каждому слайсу нужны все сегменты — заводи по необходимости, но не сваливай
рендер + состояние + доступ к данным в один файл (болезнь легаси, см.
`TableFactory.tsx`).

## 4. TypeScript и API пакетов

- `strict: true`. **`any` и `@ts-ignore` запрещены** без written-комментария
  `// ts-debt: <причина>` и согласия. Для библиотеки типы — это продукт.
- Каждый пакет экспортирует только через корневой `index.ts` (public API).
  Внутренности не импортировать из других пакетов напрямую.
- Пропсы компонентов — именованный экспортируемый тип `<Name>Props`.
- Никаких `console.log` в коммитах. Дев-логи убираем.

## 5. Стилизация

- Все стили — через **vanilla-extract** (`*.css.ts`) с токенами из `@fractalui/tokens`.
- **Запрещены** инлайн-стили с захардкоженными значениями (`style={{height: ...}}`,
  цвета строками) — болезнь легаси `AppProvider`. Размеры/цвета/отступы берём из
  токенов.
- Компоненты не должны хардкодить тему/брендинг — это приходит через token-тему.

## 6. Анти-паттерны легаси (выявлять и не повторять)

- Генерация Recoil-атомов по `md5(JSON.stringify(props))` → заменяется
  Zustand-стором / TanStack Query ключами.
- Проброс «всего подряд» через `injectionValues`/порталы («большая какашка» в
  пропсах) → типизированный контекст с явным интерфейсом.
- Сваленные в один тип-файл несвязанные типы (`contentWrappers/types.tsx`) →
  типы живут в сегменте `api/`/`model/` своего слайса.
- Хардкод layout/header/theme/auth в одном `AppProvider` → отдельные провайдеры,
  композируемые в L3.
- Файлы вида `*_fucked.tsx`, закомментированный мёртвый код → удалять.

## 7. Монорепо-оснастка

- pnpm workspaces + Turborepo. Билд пакетов — **tsup** (ESM + `.d.ts` +
  tree-shaking). Версии/чейнджлоги — Changesets.
- Правило слоёв форсится ESLint (`no-restricted-imports` / boundaries).
- Сторибук на руте показывает L0–L2; examples в `apps/` — живые L3 e2e.

## Чеклист ревью

- [ ] Импорты идут только вниз по слоям; нет завязки на SDK/стор выше `data`/`runtime`
- [ ] Используется headless-стек, а не MUI/RJSF/MRT/Recoil
- [ ] Слайс разложен по сегментам ui/model/lib/api/config, не свален в один файл
- [ ] `strict`-типы, нет `any`/`@ts-ignore`/`console.log`
- [ ] Стили через vanilla-extract + токены, нет хардкод-инлайнов
- [ ] Публичный API только через `index.ts`
