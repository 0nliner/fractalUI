import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  background: vars.color.surface,
  // Обводки нет — поверхность держится на фоне + мягкой тени.
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.sm,
  padding: vars.space.md,
  color: vars.color.fg,
  fontFamily: vars.font.family,
});
