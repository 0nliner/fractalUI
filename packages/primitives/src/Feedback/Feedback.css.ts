import { keyframes, style } from '@vanilla-extract/css';
import { media, vars } from '@fractalui/tokens';

const pulse = keyframes({
  '0%, 100%': { opacity: 0.55 },
  '50%': { opacity: 1 },
});

export const skeleton = style({
  display: 'block',
  background: vars.color.surfaceSunken,
  borderRadius: vars.radius.sm,
  animation: `${pulse} 1.4s ${vars.motion.ease} infinite`,
  '@media': {
    // Пульсация на весь экран карточек — раздражитель; для тех, кто просил
    // меньше движения, остаётся статичная плашка.
    [media.reduceMotion]: { animation: 'none' },
  },
});

export const circle = style({ borderRadius: vars.radius.full });

export const textLines = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  width: '100%',
});

export const empty = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.md,
  textAlign: 'center',
  padding: `${vars.space.xl3} ${vars.space.lg}`,
  fontFamily: vars.font.family,
  color: vars.color.fg,
});

export const emptyIcon = style({
  color: vars.color.fgSubtle,
  lineHeight: 0,
});

export const emptyIconError = style({
  color: vars.color.danger,
  lineHeight: 0,
});

export const emptyTitle = style({
  margin: 0,
  fontSize: vars.font.sizeLg,
  fontWeight: vars.font.weightMedium,
});

export const emptyDescription = style({
  margin: 0,
  maxWidth: 420,
  fontSize: vars.font.sizeMd,
  color: vars.color.muted,
  lineHeight: vars.font.lineNormal,
});
