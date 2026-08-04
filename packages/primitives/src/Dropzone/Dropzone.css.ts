import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const zone = style({
  boxSizing: 'border-box',
  width: '100%',
  minHeight: 140,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  padding: vars.space.xl,
  borderRadius: vars.radius.lg,
  background: vars.color.surfaceSunken,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeMd,
  textAlign: 'center',
  // Пунктир — единственный понятный без подписи знак «сюда можно бросить».
  border: `1px dashed ${vars.color.border}`,
  transition: `background ${vars.motion.fast} ${vars.motion.ease}, border-color ${vars.motion.fast} ${vars.motion.ease}`,
  outline: 'none',
  selectors: {
    '&[data-drop-target]': {
      borderColor: vars.color.accent,
      background: vars.color.surfaceHover,
    },
    '&[data-focus-visible]': { boxShadow: vars.shadow.focus },
    '&[data-disabled]': { opacity: 0.55 },
  },
});

export const label = style({ color: vars.color.fg });

export const hint = style({
  fontSize: vars.font.sizeSm,
  color: vars.color.fgSubtle,
});

export const button = style({
  minHeight: vars.size.control,
  padding: `0 ${vars.space.lg}`,
  borderRadius: vars.radius.md,
  border: 'none',
  background: vars.color.surface,
  color: vars.color.fg,
  fontSize: vars.font.sizeMd,
  fontFamily: vars.font.family,
  cursor: 'pointer',
  transition: `background ${vars.motion.fast} ${vars.motion.ease}`,
  selectors: {
    '&[data-hovered]': { background: vars.color.surfaceHover },
    '&[data-focus-visible]': { outline: 'none', boxShadow: vars.shadow.focus },
    '&[data-disabled]': { opacity: 0.55, cursor: 'not-allowed' },
  },
});
