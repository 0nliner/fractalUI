import { style, styleVariants } from '@vanilla-extract/css';
import { media, vars } from '@fractalui/tokens';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  background: vars.color.overlay,
  backdropFilter: 'blur(4px)',
  zIndex: vars.z.modal,
  display: 'flex',
  // База — телефон: лист прижат к низу экрана.
  alignItems: 'flex-end',
  justifyContent: 'center',
  '@media': {
    [media.md]: { alignItems: 'center' },
    [media.reduceMotion]: { backdropFilter: 'none' },
  },
});

export const modal = style({
  boxSizing: 'border-box',
  width: '100%',
  maxHeight: '90vh',
  background: vars.color.surface,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeMd,
  boxShadow: vars.shadow.xl,
  display: 'flex',
  flexDirection: 'column',
  outline: 'none',
  // Нижний лист: скругления только сверху, во всю ширину.
  borderRadius: `${vars.radius.xl} ${vars.radius.xl} 0 0`,
  '@media': {
    [media.md]: {
      borderRadius: vars.radius.xl,
      maxHeight: '85vh',
    },
  },
});

/** Ширина применяется только на десктопе — на телефоне лист всегда во всю ширину. */
export const modalSize = styleVariants({
  sm: { '@media': { [media.md]: { width: 'min(400px, 92vw)' } } },
  md: { '@media': { [media.md]: { width: 'min(560px, 92vw)' } } },
  lg: { '@media': { [media.md]: { width: 'min(880px, 92vw)' } } },
});

export const dialog = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  outline: 'none',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  padding: `${vars.space.lg} ${vars.space.lg} ${vars.space.md}`,
});

export const title = style({
  margin: 0,
  fontSize: vars.font.sizeXl,
  fontWeight: vars.font.weightBold,
  lineHeight: vars.font.lineTight,
});

export const body = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: `0 ${vars.space.lg}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const footer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.sm,
  padding: vars.space.lg,
});

export const closeBtn = style({
  flexShrink: 0,
  border: 'none',
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  fontSize: vars.font.sizeLg,
  lineHeight: 1,
  // Пальцевая зона, а не 16px крестик.
  width: vars.size.tapTarget,
  height: vars.size.tapTarget,
  display: 'grid',
  placeItems: 'center',
  borderRadius: vars.radius.sm,
  selectors: {
    '&[data-hovered]': { color: vars.color.fg, background: vars.color.surfaceHover },
    '&[data-focus-visible]': { outline: 'none', boxShadow: vars.shadow.focus },
  },
});
