import type { ThemeValues } from './themes/values';

/** Частичный override значений темы (по группам токенов). */
export type PartialThemeValues = {
  [K in keyof ThemeValues]?: Partial<ThemeValues[K]>;
};

/**
 * Состояния взаимодействия, которые выводятся из соседних токенов, если продукт
 * их не задал явно.
 *
 * Подмешивается `fg`, а не чёрный: на светлой теме он тёмный и состояние
 * затемняется, на тёмной — светлый и состояние подсвечивается. Одна формула
 * работает в обе стороны, ветки по «светлости» темы не нужно.
 *
 * Цветовых рамп (50…900) в контракте сознательно нет: это 36+ токенов, а темы
 * process_automation_bureau и game_heart мостятся к хостовым CSS-переменным
 * (`accent: 'var(--accent)'`) и физически не могут выдать 36 значений. Здесь же
 * `color-mix` собирается строкой и остаётся валидным CSS даже поверх `var()` —
 * вычислится в браузере против хостовой палитры.
 */
const DERIVED_COLORS = [
  { key: 'accentHover', from: 'accent', ratio: 88 },
  { key: 'accentActive', from: 'accent', ratio: 76 },
  { key: 'surfaceHover', from: 'surface', ratio: 94 },
  { key: 'surfaceSunken', from: 'surface', ratio: 88 },
] as const;

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
 *
 * Переопределив `accent`, продукт получает согласованные `accentHover` и
 * `accentActive` бесплатно — иначе кнопки подсвечивались бы тиловым цветом кита
 * поверх чужого акцента, и заметить это можно было бы только глазами.
 */
export function defineThemeValues(
  base: ThemeValues,
  overrides: PartialThemeValues,
): ThemeValues {
  // Перечисление групп явное и это осознанно: аннотация `: ThemeValues` не даёт
  // забыть новую группу — литерал без неё не скомпилируется. Перебор по
  // `Object.keys` такой ошибки бы не поймал, зато потребовал бы приведения:
  // при записи по ключу-union TS сводит тип цели к пересечению всех групп сразу
  // и требует, чтобы `color` содержал ещё и `brand`, и `sm`, и всё остальное.
  const pick = <K extends keyof ThemeValues>(group: K): ThemeValues[K] => ({
    ...base[group],
    ...overrides[group],
  });

  const merged: ThemeValues = {
    color: pick('color'),
    gradient: pick('gradient'),
    shadow: pick('shadow'),
    space: pick('space'),
    radius: pick('radius'),
    font: pick('font'),
    size: pick('size'),
    z: pick('z'),
    motion: pick('motion'),
  };

  for (const { key, from, ratio } of DERIVED_COLORS) {
    const stateGiven = overrides.color?.[key] !== undefined;
    const sourceGiven = overrides.color?.[from] !== undefined;
    // Источник переопределён, состояние — нет: базовое значение относится
    // к палитре кита и после подмены источника стало бы бессмысленным.
    if (!stateGiven && sourceGiven) {
      merged.color[key] =
        `color-mix(in oklab, ${merged.color[from]} ${ratio}%, ${merged.color.fg})`;
    }
  }

  return merged;
}
