/**
 * Брейкпоинты и адаптивные хелперы (plain TS, вне контракта темы).
 *
 * Почему НЕ токены: `@media (min-width: var(--bp-md))` — невалидный CSS.
 * Медиа-условия вычисляются до каскада и кастомные свойства не читают. Значит
 * брейкпоинт обязан быть литералом на этапе сборки, а не переменной темы.
 *
 * Доктрина (см. CLAUDE.md и скилл fractalui-responsive):
 *  - медиа-запросы живут ВНУТРИ `.css.ts` своего компонента, не в глобальном
 *    файле и не в JS-хуке — так они остаются zero-runtime и рядом с кодом;
 *  - только mobile-first, только `min-width`. `max-width` запрещён: пересечение
 *    двух направлений даёт правила, которые гасят друг друга в середине шкалы;
 *  - container queries — точечно, для карточек, которые рендерятся и в узкой
 *    колонке, и во всю ширину. Им ширина вьюпорта отвечает не на тот вопрос.
 */

/** Опорные ширины в пикселях. */
export const bp = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  xl2: 1536,
} as const;

export type Breakpoint = keyof typeof bp;

/**
 * Готовые условия для ключа `@media` в vanilla-extract.
 *
 * ```ts
 * export const grid = style({
 *   gridTemplateColumns: '1fr',
 *   '@media': {
 *     [media.md]: { gridTemplateColumns: 'repeat(2, 1fr)' },
 *     [media.lg]: { gridTemplateColumns: 'repeat(4, 1fr)' },
 *   },
 * });
 * ```
 */
export const media = {
  sm: `screen and (min-width: ${bp.sm}px)`,
  md: `screen and (min-width: ${bp.md}px)`,
  lg: `screen and (min-width: ${bp.lg}px)`,
  xl: `screen and (min-width: ${bp.xl}px)`,
  xl2: `screen and (min-width: ${bp.xl2}px)`,
  /** Ховер-эффекты только там, где курсор реально есть: на тач-экране
   *  :hover «залипает» после тапа до следующего касания. */
  hover: '(hover: hover)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
} as const;

type Style = Record<string, unknown>;

/**
 * Сахар над `@media`, чтобы не писать вложенный объект руками:
 *
 * ```ts
 * export const section = style(
 *   responsive({ padding: vars.space.lg }, { md: { padding: vars.space.xl3 } }),
 * );
 * ```
 */
export function responsive(base: Style, at: Partial<Record<Breakpoint, Style>>): Style {
  const queries: Record<string, Style> = {};
  for (const key of Object.keys(at) as Breakpoint[]) {
    const value = at[key];
    if (value) queries[media[key]] = value;
  }
  return { ...base, '@media': queries };
}

/**
 * Объявляет элемент контейнером для container queries.
 * Про имя легко забыть, а без него `@container` молча не сработает —
 * поэтому оно обязательный аргумент.
 */
export function container(name: string): Style {
  return { containerType: 'inline-size', containerName: name };
}

/**
 * Правило по ширине КОНТЕЙНЕРА, а не вьюпорта.
 *
 * Нужно там, где один компонент рендерится в разном по ширине месте: карточка
 * товара в сетке из четырёх колонок и та же карточка в узком сайдбаре. Вьюпорт
 * в обоих случаях одинаковый и правильного ответа не даёт.
 *
 * Требует, чтобы предок был объявлен через `container(name)`.
 */
export function atContainer(name: string, minWidth: number, styles: Style): Style {
  return {
    '@container': {
      [`${name} (min-width: ${minWidth}px)`]: styles,
    },
  };
}
