import { style } from '@vanilla-extract/css';
import { media, vars } from '@fractalui/tokens';

/**
 * Каталог: на телефоне одна колонка (панель фильтров скрыта, её заменяет
 * кнопка со шторкой), с md — сайдбар фильтров слева.
 */
export const catalogLayout = style({
  display: 'grid',
  gap: vars.space.xl,
  gridTemplateColumns: 'minmax(0, 1fr)',
  alignItems: 'start',
  '@media': {
    [media.md]: { gridTemplateColumns: '240px minmax(0, 1fr)' },
    [media.lg]: { gridTemplateColumns: '280px minmax(0, 1fr)' },
  },
});
