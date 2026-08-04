# fractalUI

Слоистый headless **UI-кит + конфиг-фреймворк** для быстрой сборки web-интерфейсов
(админки/CRM) под продукты автора. Сильная идея проекта: кормишь OpenAPI-спеку +
декларативный `AppConfig` — на выходе готовое приложение (таблицы, формы, фиды,
роутинг, экшены, оверлеи).

> ⚠️ **Статус: миграция легаси → целевая архитектура.**
> Текущий код живёт плоско в [`src/`](src/) (Recoil, MUI, RJSF, `@ts-ignore`, всё
> слиплось в один слой). Это **легаси, которое мы поэтапно переносим** в монорепо
> ниже. Любой новый код пиши по целевой архитектуре, а не по образцу `src/`.
> Старый код трогаем только в рамках фаз миграции.

## Зафиксированные решения (не пересматривать без явного запроса)

| Решение | Выбор |
|---|---|
| Позиционирование | Слоистый кит + фреймворк (L0–L3) |
| Состояние/данные | **hey-api** (типизированный SDK) + **Zustand** (UI-state). Опц. `@tanstack/react-query`-плагин hey-api для кэша |
| Визуал | **Headless + свои дизайн-токены** (без MUI) |
| Пакетирование | **Monorepo** (pnpm workspaces + Turborepo) |
| Типы | `strict: true`. `@ts-ignore`/`any` запрещены без письменного обоснования |

## Технические слои (главное правило)

```
tokens (L0) ← primitives (L1) ← patterns (L2) ← runtime (L3)
```

**Импорт только вниз по стрелке.** `primitives` не знает про сеть и стор.
`patterns` принимает данные через props/render-props и не знает про hey-api.
Только `runtime`/`data` завязаны на SDK и Zustand. Это форсится ESLint-правилом.

## Headless-стек (чем заменяем MUI-завязки)

| Назначение | Используем |
|---|---|
| Токены/темы | **vanilla-extract** (zero-runtime, типобезопасно) |
| Примитивы/a11y | **React Aria Components** |
| Таблицы | **TanStack Table** (вместо material-react-table) |
| Формы из схемы | **React Hook Form + AJV** (вместо `@rjsf/mui`) |
| Дата-пикеры | **React Aria DatePicker** (вместо `@mui/x-date-pickers`) |
| Server-state | **hey-api** SDK (+ опц. TanStack Query) |
| UI-state | **Zustand** |

MUI / RJSF / material-react-table / Recoil / emotion-инлайн-стили — **легаси,
в новый код не добавлять.**

## Раскладка монорепо (целевая)

```
packages/
  tokens/      L0  дизайн-токены + темы
  primitives/  L1  чистые компоненты (Button, Avatar, Nav, ActionsList, LavaLamp)
  patterns/    L2  AutoForm, AutoTable, Feed — schema-driven, данные через props
  runtime/     L3  AppProvider, PageSwitcher, actions-engine, auth
  data/        ┄   обёртка hey-api + Zustand-сторы
  icons/       ┄   svg→компоненты
apps/
  storybook/   витрина
  examples/    MetalCrm / SchoolProject — эталонные FSD-приложения
```

## FSD

- **Пакеты кита = слой `shared` из FSD**, разнесённый на под-пакеты по L0–L3.
  Внутри слайса — FSD-сегменты `ui / model / lib / api / config`.
- **apps/ — полноценный FSD** (`app/pages/widgets/features/entities/shared`),
  где роль `shared/ui` играют `@fractalui/*`.

## Детальные правила — в скиллах

- **`fractalui-architecture`** — слои, правила зависимостей, FSD-сегменты, конвенции,
  анти-паттерны легаси. Читать перед любой правкой кода кита.
- **`fractalui-new-slice`** — рецепт добавления нового компонента/паттерна/пакета.
