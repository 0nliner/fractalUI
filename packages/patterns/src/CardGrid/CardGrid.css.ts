import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xl2,
});

export const skeletonCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

/**
 * Обёртка существует только ради ключа и в раскладке участвовать не должна:
 * `display: contents` делает элементом сетки саму карточку. Иначе растягивалась
 * бы обёртка, а карточка внутри сохраняла свою высоту — и в ряду они не
 * выравнивались по нижнему краю.
 */
export const cell = style({ display: 'contents' });
