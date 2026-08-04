import { createThemeContract } from '@vanilla-extract/css';

/**
 * Контракт дизайн-токенов fractalUI (L0) — ТОЛЬКО форма (имена CSS-переменных).
 *
 * Значения подставляются темами (`lightTheme`/`darkTheme`) или брендом продукта
 * через `createTheme(vars, values)` в `*.css.ts`. Компоненты L1+ ссылаются ТОЛЬКО
 * на `vars.*`, без хардкода цветов/размеров.
 */
export const vars = createThemeContract({
  color: {
    bg: null,
    surface: null,
    fg: null,
    muted: null,
    accent: null,
    accentFg: null,
    border: null,
    danger: null,
    overlay: null,
  },
  // Фирменный градиент fractalUI (teal → green) — узнаваемая айдентика.
  gradient: {
    brand: null,
  },
  // По умолчанию обводок нет — поверхности держатся на фоне + тенях.
  shadow: {
    sm: null,
    md: null,
  },
  space: { xs: null, sm: null, md: null, lg: null, xl: null },
  radius: { sm: null, md: null, lg: null, full: null },
  font: {
    family: null,
    sizeSm: null,
    sizeMd: null,
    sizeLg: null,
    weightRegular: null,
    weightBold: null,
  },
});

export type Vars = typeof vars;
