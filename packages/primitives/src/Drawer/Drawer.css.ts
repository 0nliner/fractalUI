import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  background: vars.color.overlay,
  backdropFilter: 'blur(4px)',
  zIndex: 1000,
  display: 'flex',
});

export const modal = styleVariants({
  right: { height: '100%', width: 'min(420px, 92vw)', marginLeft: 'auto' },
  left: { height: '100%', width: 'min(420px, 92vw)', marginRight: 'auto' },
});

export const panel = style({
  height: '100%',
  boxSizing: 'border-box',
  background: vars.color.surface,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeMd,
  boxShadow: vars.shadow.md,
  padding: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  outline: 'none',
  overflow: 'auto',
});

/**
 * Панель в resizable-режиме: скролл вынесен внутрь (`scroll`), сама панель —
 * relative-контейнер без прокрутки, чтобы абсолютная шторка у внутреннего края
 * не уезжала вместе с контентом.
 */
export const panelResizable = style({
  height: '100%',
  boxSizing: 'border-box',
  background: vars.color.surface,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeMd,
  boxShadow: vars.shadow.md,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  outline: 'none',
  overflow: 'hidden',
});

export const scroll = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  padding: vars.space.lg,
});

/**
 * Шторка ресайза у внутреннего края панели (образец — ResizablePanel.handle):
 * тонкая полоса с широкой зоной захвата (`::before` ±3px), подсветка акцентом.
 */
export const resizeHandle = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: 1,
  zIndex: 1,
  background: vars.color.border,
  cursor: 'col-resize',
  touchAction: 'none',
  transition: 'background .12s ease',
  selectors: {
    '&::before': { content: '""', position: 'absolute', top: 0, bottom: 0, left: -3, right: -3 },
    '&:hover, &[data-dragging="true"]': { background: vars.color.accent },
    '&:focus-visible': { outline: `2px solid ${vars.color.accent}`, outlineOffset: 1 },
  },
});

/** Сторона внутреннего края: панель справа → ручка слева, и наоборот. */
export const handleSide = styleVariants({
  right: { left: 0 },
  left: { right: 0 },
});

export const header = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' });
export const title = style({ fontSize: vars.font.sizeLg, fontWeight: vars.font.weightBold, margin: 0 });

export const closeBtn = style({
  border: 'none',
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  fontSize: 18,
  lineHeight: 1,
  padding: vars.space.xs,
  borderRadius: vars.radius.sm,
  selectors: {
    '&[data-hovered]': { color: vars.color.fg, background: vars.color.bg },
  },
});
