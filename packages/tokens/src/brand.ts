import type { ThemeValues } from './themes/values';

/** Частичный override значений темы (по группам токенов). */
export type PartialThemeValues = {
  [K in keyof ThemeValues]?: Partial<ThemeValues[K]>;
};

/**
 * Собирает значения брендовой темы поверх базовой (light/dark).
 * Чистый TS — без vanilla-extract. Сам класс темы потребитель создаёт в своём
 * `*.css.ts`:
 *
 * ```ts
 * import { createTheme } from '@vanilla-extract/css';
 * import { vars, lightValues, defineThemeValues } from '@fractalui/tokens';
 *
 * export const acmeTheme = createTheme(
 *   vars,
 *   defineThemeValues(lightValues, { color: { accent: '#ff0066' } }),
 * );
 * ```
 */
export function defineThemeValues(
  base: ThemeValues,
  overrides: PartialThemeValues,
): ThemeValues {
  return {
    color: { ...base.color, ...overrides.color },
    gradient: { ...base.gradient, ...overrides.gradient },
    shadow: { ...base.shadow, ...overrides.shadow },
    space: { ...base.space, ...overrides.space },
    radius: { ...base.radius, ...overrides.radius },
    font: { ...base.font, ...overrides.font },
  };
}
