import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const scrim = style({
  position: 'fixed',
  inset: 0,
  zIndex: 40,
  background: vars.color.overlay,
  backdropFilter: 'blur(2px)',
  WebkitBackdropFilter: 'blur(2px)',
});

export const panel = style({
  position: 'absolute',
  width: 256,
  overflow: 'hidden',
  borderRadius: vars.radius.lg,
  background: vars.color.surface,
  boxShadow: vars.shadow.md,
  fontFamily: vars.font.family,
});

export const head = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const headRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
});

export const title = style({
  margin: 0,
  fontSize: vars.font.sizeMd,
  fontWeight: vars.font.weightBold,
  color: vars.color.fg,
});

export const more = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: vars.font.sizeSm,
  color: vars.color.accent,
});

export const description = style({
  margin: `4px 0 0`,
  fontSize: vars.font.sizeSm,
  lineHeight: 1.35,
  color: vars.color.muted,
});

export const list = style({ padding: `${vars.space.xs} 0` });

export const item = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.xs} ${vars.space.md}`,
  border: 'none',
  background: 'transparent',
  textAlign: 'left',
  cursor: 'pointer',
  color: vars.color.fg,
  transition: 'background .12s',
  selectors: {
    '&[data-hovered]': { background: vars.color.bg },
    '&[data-focus-visible]': { outline: `2px solid ${vars.color.accent}`, outlineOffset: -2 },
  },
});

export const itemIcon = style({ color: vars.color.muted, display: 'inline-flex' });

export const itemBody = style({ flex: 1, minWidth: 0 });

export const itemLabel = style({
  display: 'block',
  fontSize: vars.font.sizeMd,
  lineHeight: 1.2,
});

export const itemDesc = style({
  display: 'block',
  fontSize: vars.font.sizeSm,
  color: vars.color.muted,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const itemBadge = style({
  minWidth: 16,
  height: 16,
  padding: '0 4px',
  borderRadius: vars.radius.full,
  background: vars.color.accent,
  color: vars.color.accentFg,
  fontSize: vars.font.sizeSm,
  fontWeight: vars.font.weightBold,
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
