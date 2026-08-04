import { style } from '@vanilla-extract/css';
import { media, vars } from '@fractalui/tokens';

export const root = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.xs,
  fontFamily: vars.font.family,
});

const cell = style({
  minWidth: vars.size.tapTarget,
  height: vars.size.tapTarget,
  display: 'grid',
  placeItems: 'center',
  border: 'none',
  borderRadius: vars.radius.md,
  background: 'transparent',
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeMd,
  fontVariantNumeric: 'tabular-nums',
  cursor: 'pointer',
  transition: `background ${vars.motion.fast} ${vars.motion.ease}`,
  selectors: {
    '&:hover:not(:disabled)': { background: vars.color.surfaceHover },
    '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus },
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
  },
});

export const arrow = cell;
export const page = cell;

export const current = style({
  background: vars.color.accent,
  color: vars.color.accentFg,
  selectors: {
    '&:hover:not(:disabled)': { background: vars.color.accentHover },
  },
});

export const gap = style({
  minWidth: vars.size.control,
  textAlign: 'center',
  color: vars.color.fgSubtle,
});

/** Ниже md остаётся «3 / 12»: десяток кнопок по 44px в строку не влезает. */
export const numbers = style({
  display: 'none',
  alignItems: 'center',
  gap: vars.space.xs,
  '@media': {
    [media.md]: { display: 'flex' },
  },
});

export const compact = style({
  padding: `0 ${vars.space.md}`,
  fontSize: vars.font.sizeMd,
  color: vars.color.muted,
  fontVariantNumeric: 'tabular-nums',
  '@media': {
    [media.md]: { display: 'none' },
  },
});
