import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeMd,
  color: vars.color.fg,
  cursor: 'pointer',
  selectors: {
    '&[data-focus-visible]': { outline: `2px solid ${vars.color.accent}`, outlineOffset: '2px', borderRadius: vars.radius.sm },
  },
});

export const track = style({
  width: 34,
  height: 18,
  boxSizing: 'border-box',
  borderRadius: vars.radius.full,
  background: vars.color.border,
  padding: 2,
  transition: 'background .15s ease',
  flexShrink: 0,
});

export const thumb = style({
  display: 'block',
  width: 14,
  height: 14,
  borderRadius: vars.radius.full,
  background: vars.color.bg,
  transition: 'transform .15s ease',
});

globalStyle(`${root}[data-selected] ${track}`, { background: vars.color.accent });
globalStyle(`${root}[data-selected] ${thumb}`, { transform: 'translateX(16px)' });
