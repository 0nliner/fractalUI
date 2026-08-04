import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  minWidth: 0,
});

export const main = style({
  width: '100%',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
  background: vars.color.surfaceSunken,
  cursor: 'zoom-in',
  display: 'block',
  selectors: {
    '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus },
  },
});

export const mainImg = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

export const placeholder = style({
  width: '100%',
  height: '100%',
  background: vars.color.surfaceSunken,
});

/**
 * Лента превью прокручивается вбок с привязкой: на телефоне вертикальный
 * список съел бы весь экран, а обрезать превью нельзя — по ним и выбирают.
 */
export const thumbs = style({
  display: 'flex',
  gap: vars.space.sm,
  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  paddingBottom: vars.space.xs,
  scrollbarWidth: 'thin',
});

export const thumb = style({
  flex: '0 0 auto',
  width: 72,
  height: 72,
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.md,
  overflow: 'hidden',
  background: vars.color.surfaceSunken,
  cursor: 'pointer',
  scrollSnapAlign: 'start',
  opacity: 0.65,
  transition: `opacity ${vars.motion.fast} ${vars.motion.ease}, box-shadow ${vars.motion.fast} ${vars.motion.ease}`,
  selectors: {
    '&:hover': { opacity: 1 },
    '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus, opacity: 1 },
  },
});

export const thumbActive = style({
  opacity: 1,
  boxShadow: `inset 0 0 0 2px ${vars.color.accent}`,
});

export const thumbImg = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});
