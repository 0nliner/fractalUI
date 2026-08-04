import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const tooltip = style({
  background: vars.color.surface,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.sm,
  boxShadow: vars.shadow.md,
  maxWidth: 240,
});
