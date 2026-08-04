import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  minWidth: 0,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  color: vars.color.muted,
});

export const crumb = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  maxWidth: 220,
  padding: `2px ${vars.space.xs}`,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: 'inherit',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  cursor: 'pointer',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  selectors: {
    '&:hover:not(:disabled)': { background: vars.color.bg, color: vars.color.fg },
    '&:disabled': { cursor: 'default' },
  },
});

/** Последнее звено — где мы сейчас. Не ссылка и визуально главное. */
export const current = style({
  color: vars.color.fg,
  fontWeight: vars.font.weightBold,
  cursor: 'default',
});

export const sep = style({
  flexShrink: 0,
  opacity: 0.5,
  userSelect: 'none',
});

/** Схлопнутая середина: «…» с полным путём в title. */
export const ellipsis = style({
  flexShrink: 0,
  padding: `0 ${vars.space.xs}`,
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  cursor: 'pointer',
  borderRadius: vars.radius.sm,
  selectors: {
    '&:hover': { background: vars.color.bg, color: vars.color.fg },
  },
});
