import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  fontFamily: vars.font.family,
  color: vars.color.fg,
});

/** Полоса управления галереей — мета, не часть продукта. */
export const bar = style({
  flexShrink: 0,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `0 ${vars.space.sm}`,
  borderBottom: `1px solid ${vars.color.border}`,
  background: `color-mix(in srgb, ${vars.color.accent} 6%, transparent)`,
});

export const screens = style({
  display: 'flex',
  gap: 4,
  overflowX: 'auto',
  minWidth: 0,
});

const tabBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 10px',
  border: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  borderRadius: vars.radius.md,
  background: 'transparent',
  color: vars.color.muted,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
});

export const tab = style([tabBase]);
export const tabActive = style([
  tabBase,
  { background: vars.color.accent, color: vars.color.accentFg },
]);

export const toggles = style({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  flexShrink: 0,
});

const toggleBase = style({
  padding: '4px 8px',
  border: 'none',
  cursor: 'pointer',
  borderRadius: vars.radius.md,
  background: 'transparent',
  color: vars.color.muted,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
});

export const toggle = style([toggleBase]);
export const toggleOn = style([toggleBase, { background: vars.color.surface, color: vars.color.fg }]);

export const caption = style({
  flexShrink: 0,
  padding: `6px ${vars.space.md}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const captionTitle = style({
  margin: 0,
  fontSize: vars.font.sizeMd,
  fontWeight: vars.font.weightBold,
});

export const captionDesc = style({
  margin: '2px 0 0',
  fontSize: vars.font.sizeSm,
  lineHeight: 1.35,
  color: vars.color.muted,
});

export const stage = style({ flex: 1, minHeight: 0, overflow: 'auto' });

export const legend = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  padding: `4px ${vars.space.md}`,
  borderTop: `1px solid ${vars.color.border}`,
  fontSize: vars.font.sizeSm,
  color: vars.color.muted,
});

export const legendItem = style({ display: 'inline-flex', alignItems: 'center', gap: 6 });

export const swatchDashed = style({
  width: 12,
  height: 12,
  borderRadius: vars.radius.sm,
  border: `1px dashed color-mix(in srgb, ${vars.color.muted} 60%, transparent)`,
});

export const swatchAccent = style({
  width: 12,
  height: 12,
  borderRadius: vars.radius.sm,
  background: vars.color.accent,
});
