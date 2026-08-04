import { style } from '@vanilla-extract/css';
import { media, vars } from '@fractalui/tokens';

export const root = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  // Цель нажатия — вся строка, не квадратик 18px. Но высота идёт от плотности:
  // 44px безусловно развалили бы плотные админки, ради которых кит и делался.
  // Пальцевой минимум раздаётся только там, где палец и есть.
  minHeight: vars.size.control,
  '@media': {
    [media.coarse]: { minHeight: vars.size.tapTarget },
  },
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeMd,
  color: vars.color.fg,
  cursor: 'pointer',
  selectors: {
    '&[data-disabled]': { opacity: 0.55, cursor: 'not-allowed' },
  },
});

export const box = style({
  flexShrink: 0,
  width: 18,
  height: 18,
  display: 'grid',
  placeItems: 'center',
  borderRadius: vars.radius.sm,
  background: vars.color.surface,
  color: vars.color.accentFg,
  boxShadow: `inset 0 0 0 1px ${vars.color.border}`,
  transition: `background ${vars.motion.fast} ${vars.motion.ease}, box-shadow ${vars.motion.fast} ${vars.motion.ease}`,
  selectors: {
    [`${root}[data-hovered] &`]: { boxShadow: `inset 0 0 0 1px ${vars.color.accent}` },
    [`${root}[data-selected] &`]: { background: vars.color.accent, boxShadow: 'none' },
    [`${root}[data-indeterminate] &`]: { background: vars.color.accent, boxShadow: 'none' },
    [`${root}[data-focus-visible] &`]: { boxShadow: vars.shadow.focus },
    [`${root}[data-invalid] &`]: { boxShadow: `inset 0 0 0 1px ${vars.color.danger}` },
  },
});

export const mark = style({ width: 14, height: 14 });

export const label = style({ lineHeight: vars.font.lineNormal });

export const group = style({
  display: 'flex',
  flexDirection: 'column',
});
