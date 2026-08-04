# @fractalui/tokens

L0 — дизайн-токены и темы fractalUI на [vanilla-extract](https://vanilla-extract.style/).

## Что внутри

- `vars` — **контракт** токенов (имена CSS-переменных). Компоненты L1+ ссылаются
  только на `vars.*`.
- `lightTheme` / `darkTheme` — классы готовых тем.
- `lightValues` / `darkValues` — значения тем (plain TS) для расширения под бренд.
- `defineThemeValues(base, overrides)` — мердж значений под брендинг продукта.

## Подключение

CSS отдаётся отдельным файлом (так собираются VE-библиотеки) — импортируй его один
раз в точке входа приложения, а класс темы навесь на корень:

```tsx
import '@fractalui/tokens/styles.css';
import { lightTheme } from '@fractalui/tokens';

export function Root() {
  return <div className={lightTheme}>{/* app */}</div>;
}
```

Переключение света/тьмы — сменой класса `lightTheme` ⇄ `darkTheme` на корне.

## Брендинг под продукт

Класс темы создаётся в `*.css.ts` потребителя (так требует vanilla-extract):

```ts
// theme.css.ts
import { createTheme } from '@vanilla-extract/css';
import { vars, lightValues, defineThemeValues } from '@fractalui/tokens';

export const acmeTheme = createTheme(
  vars,
  defineThemeValues(lightValues, { color: { accent: '#ff0066' } }),
);
```
