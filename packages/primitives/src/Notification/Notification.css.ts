import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space.sm,
  background: vars.color.surface,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeMd,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.sm,
  padding: `${vars.space.sm} ${vars.space.md}`,
  paddingLeft: vars.space.md,
  minWidth: 220,
  overflow: 'hidden',
});

// Статус-полоса слева — индикатор, не обводка.
export const stripeTone = styleVariants({
  info: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: vars.color.accent },
  success: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#7caf54' },
  error: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: vars.color.danger },
});

export const body = style({ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 });
export const title = style({ fontWeight: vars.font.weightBold });
export const text = style({ color: vars.color.muted, fontSize: vars.font.sizeSm });

export const closeBtn = style({
  border: 'none',
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  fontSize: 16,
  lineHeight: 1,
  padding: 0,
  flexShrink: 0,
  selectors: { '&:hover': { color: vars.color.fg } },
});
