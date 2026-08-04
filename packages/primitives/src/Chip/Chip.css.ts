import { style } from '@vanilla-extract/css';
import { media, vars } from '@fractalui/tokens';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  minHeight: vars.size.controlSm,
  paddingInline: vars.space.md,
  borderRadius: vars.radius.full,
  background: vars.color.surface,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  maxWidth: '100%',
  transition: `background ${vars.motion.fast} ${vars.motion.ease}, color ${vars.motion.fast} ${vars.motion.ease}`,
  '@media': {
    [media.coarse]: { minHeight: vars.size.tapTarget },
  },
});

export const selected = style({
  background: vars.color.accent,
  color: vars.color.accentFg,
});

export const disabled = style({ opacity: 0.55 });

export const text = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const pressArea = style([
  text,
  {
    border: 'none',
    background: 'transparent',
    color: 'inherit',
    font: 'inherit',
    padding: 0,
    cursor: 'pointer',
    borderRadius: vars.radius.full,
    selectors: {
      [`${root}:not(${selected}):hover &`]: { color: vars.color.accent },
      '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus },
      '&:disabled': { cursor: 'not-allowed' },
    },
  },
]);

export const remove = style({
  flexShrink: 0,
  border: 'none',
  background: 'transparent',
  color: 'currentColor',
  opacity: 0.6,
  cursor: 'pointer',
  padding: 0,
  fontSize: vars.font.sizeSm,
  lineHeight: 1,
  borderRadius: vars.radius.full,
  selectors: {
    '&:hover': { opacity: 1 },
    '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus, opacity: 1 },
    '&:disabled': { cursor: 'not-allowed' },
  },
});
