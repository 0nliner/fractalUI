import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = styleVariants({
  vertical: { display: 'flex', flexDirection: 'column', gap: vars.space.xs },
  horizontal: { display: 'flex', flexDirection: 'row', gap: vars.space.xs, alignItems: 'center' },
});

export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.md,
  border: 'none',
  background: 'transparent',
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeMd,
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
  whiteSpace: 'nowrap',
  transition: 'background .12s ease, color .12s ease',
  selectors: {
    '&[data-hovered]': { background: vars.color.bg },
    '&[data-active="true"]': { background: vars.color.accent, color: vars.color.accentFg },
    '&[data-focus-visible]': { outline: `2px solid ${vars.color.accent}`, outlineOffset: '-2px' },
    '&[data-disabled]': { opacity: 0.45, cursor: 'not-allowed' },
  },
});

export const icon = style({
  display: 'inline-flex',
  width: 18,
  height: 18,
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});
