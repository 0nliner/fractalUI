import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  fontFamily: vars.font.family,
  color: vars.color.fg,
  maxWidth: 420,
});

export const title = style({
  fontSize: vars.font.sizeLg,
  fontWeight: vars.font.weightBold,
  margin: 0,
});

export const field = style({ display: 'flex', flexDirection: 'column', gap: vars.space.xs });
export const label = style({ fontSize: vars.font.sizeSm, color: vars.color.muted });

export const select = style({
  boxSizing: 'border-box',
  width: '100%',
  background: vars.color.surface,
  color: vars.color.fg,
  border: 'none',
  borderRadius: vars.radius.md,
  padding: '6px 10px',
  fontSize: vars.font.sizeMd,
  fontFamily: vars.font.family,
  transition: 'box-shadow .15s ease',
  selectors: { '&:focus': { outline: 'none', boxShadow: `inset 0 0 0 1px ${vars.color.accent}` } },
});

export const error = style({ fontSize: vars.font.sizeSm, color: vars.color.danger });

export const actions = style({ display: 'flex', gap: vars.space.sm, marginTop: vars.space.sm });
