import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const menu = style({
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

export const destructive = style({
  color: vars.color.danger,
  selectors: {
    '&[data-focused]': { background: vars.color.danger, color: vars.color.accentFg },
    '&[data-hovered]': { background: vars.color.danger, color: vars.color.accentFg },
  },
});

export const separator = style({
  height: 1,
  border: 'none',
  background: vars.color.border,
  margin: `${vars.space.xs} 0`,
});
