import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const grid = style({
  display: 'grid',
  gap: vars.space.md,
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  fontFamily: vars.font.family,
});

export const field = style({ display: 'flex', flexDirection: 'column', gap: 2 });
export const label = style({ fontSize: vars.font.sizeSm, color: vars.color.muted });
export const value = style({ fontSize: vars.font.sizeMd, color: vars.color.fg });
export const actions = style({ display: 'flex', gap: vars.space.xs, marginTop: vars.space.xs });

export const empty = style({
  padding: vars.space.xl,
  textAlign: 'center',
  color: vars.color.muted,
  fontFamily: vars.font.family,
});
