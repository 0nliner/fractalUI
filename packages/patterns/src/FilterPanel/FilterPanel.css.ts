import { style } from '@vanilla-extract/css';
import { media, vars } from '@fractalui/tokens';

/** База — телефон: панель скрыта, показывается кнопка со шторкой. */
export const desktop = style({
  display: 'none',
  flexDirection: 'column',
  gap: vars.space.xl,
  '@media': {
    [media.md]: { display: 'flex' },
  },
});

export const mobile = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  alignItems: 'flex-start',
  '@media': {
    [media.md]: { display: 'none' },
  },
});

export const chips = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const optionRow = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: vars.space.sm,
  width: '100%',
});

export const count = style({
  fontSize: vars.font.sizeSm,
  color: vars.color.fgSubtle,
  fontVariantNumeric: 'tabular-nums',
});
