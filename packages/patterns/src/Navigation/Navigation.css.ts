import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  width: 240,
  boxSizing: 'border-box',
  height: '100%',
  padding: vars.space.md,
  background: vars.color.surface,
  boxShadow: vars.shadow.sm,
  borderRadius: vars.radius.lg,
  fontFamily: vars.font.family,
  color: vars.color.fg,
});

export const brand = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.xs} ${vars.space.sm}`,
});

export const title = style({ fontSize: vars.font.sizeLg, fontWeight: vars.font.weightBold });

export const footer = style({ marginTop: 'auto', paddingTop: vars.space.sm });
