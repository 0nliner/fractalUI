import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

const starSize = createVar();

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontFamily: vars.font.family,
  color: vars.color.fg,
});

export const sizes = styleVariants({
  sm: { vars: { [starSize]: '14px' }, fontSize: vars.font.sizeSm },
  md: { vars: { [starSize]: '18px' }, fontSize: vars.font.sizeMd },
  lg: { vars: { [starSize]: '24px' }, fontSize: vars.font.sizeLg },
});

export const stars = style({ display: 'inline-flex', gap: 2 });

export const star = style({
  position: 'relative',
  display: 'inline-block',
  width: starSize,
  height: starSize,
  lineHeight: 0,
});

export const starIcon = style({ width: starSize, height: starSize, display: 'block' });

export const starEmpty = style({ fill: vars.color.surfaceSunken });

export const starFull = style({ fill: vars.color.warning });

/** Обрезка по ширине — так дробная оценка закрашивает часть звезды. */
export const starFillClip = style({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  lineHeight: 0,
});

export const starButton = style({
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  lineHeight: 0,
  borderRadius: vars.radius.sm,
  selectors: {
    '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus },
  },
});

export const label = style({ color: vars.color.muted, whiteSpace: 'nowrap' });
