import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  position: 'absolute',
  width: 'fit-content',
  minWidth: 200,
  background: vars.color.surface,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeMd,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.md,
  overflow: 'hidden',
});

export const bar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  background: vars.color.bg,
  cursor: 'grab',
  userSelect: 'none',
});

export const barTitle = style({ fontSize: vars.font.sizeSm, fontWeight: vars.font.weightBold, color: vars.color.muted });

export const close = style({
  border: 'none',
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  fontSize: 16,
  lineHeight: 1,
  padding: 0,
  selectors: { '&:hover': { color: vars.color.fg } },
});

export const content = style({ padding: vars.space.md });
