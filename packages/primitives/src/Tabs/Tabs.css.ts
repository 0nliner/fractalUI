import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({ fontFamily: vars.font.family, color: vars.color.fg });

export const list = style({
  display: 'flex',
  gap: vars.space.xs,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const tab = style({
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  color: vars.color.muted,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeMd,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  cursor: 'pointer',
  borderBottom: '2px solid transparent',
  marginBottom: -1,
  transition: 'color .12s ease, border-color .12s ease',
  selectors: {
    '&[data-hovered]': { color: vars.color.fg },
    '&[data-selected]': { color: vars.color.fg, borderBottomColor: vars.color.accent },
    '&[data-focus-visible]': { outline: `2px solid ${vars.color.accent}`, outlineOffset: '2px' },
  },
});

export const panel = style({ paddingTop: vars.space.md, fontSize: vars.font.sizeMd });
