import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  background: vars.color.overlay,
  backdropFilter: 'blur(4px)',
  zIndex: 1100,
  display: 'flex',
});

export const modal = style({ width: '100%', height: '100%', outline: 'none' });

export const dialog = style({ width: '100%', height: '100%', outline: 'none' });

export const surface = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  fontFamily: vars.font.family,
});

export const toolbar = style({
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
});

export const zoomReadout = style({
  padding: '2px 8px',
  borderRadius: vars.radius.sm,
  background: vars.color.surface,
  color: vars.color.muted,
  fontSize: vars.font.sizeSm,
  fontVariantNumeric: 'tabular-nums',
});

export const closeBtn = style({
  border: 'none',
  background: vars.color.surface,
  color: vars.color.fg,
  cursor: 'pointer',
  fontSize: 18,
  lineHeight: 1,
  padding: '4px 8px',
  borderRadius: vars.radius.sm,
  selectors: { '&[data-hovered]': { color: vars.color.accent } },
});

export const hintBar = style({
  position: 'absolute',
  bottom: 12,
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: vars.font.sizeSm,
  color: vars.color.muted,
  pointerEvents: 'none',
});

export const img = style({
  maxWidth: '92vw',
  maxHeight: '86vh',
  userSelect: 'none',
});
