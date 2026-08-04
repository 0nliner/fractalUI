import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const trigger = style({
  flexShrink: 0,
  background: 'transparent',
  border: 'none',
  color: vars.color.muted,
  fontSize: vars.font.sizeSm,
  cursor: 'pointer',
  padding: 0,
  selectors: {
    '&[data-hovered]': { color: vars.color.fg },
    '&[data-focus-visible]': { outline: 'none', boxShadow: vars.shadow.focus },
  },
});

export const list = style({
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

export const empty = style({
  padding: `${vars.space.md} ${vars.space.md}`,
  fontSize: vars.font.sizeSm,
  color: vars.color.fgSubtle,
});
