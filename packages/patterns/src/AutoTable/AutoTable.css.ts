import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const wrapper = style({
  width: '100%',
  overflow: 'auto',
  // Без обводки — поверхность на фоне + мягкой тени.
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.sm,
  background: vars.color.surface,
  fontFamily: vars.font.family,
  color: vars.color.fg,
});

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: vars.font.sizeMd,
});

export const th = style({
  textAlign: 'left',
  padding: `${vars.space.sm} ${vars.space.md}`,
  color: vars.color.muted,
  fontWeight: vars.font.weightBold,
  fontSize: vars.font.sizeSm,
  borderBottom: `1px solid ${vars.color.border}`,
  whiteSpace: 'nowrap',
  userSelect: 'none',
});

export const thSortable = style({
  cursor: 'pointer',
  selectors: { '&:hover': { color: vars.color.fg } },
});

export const sortIcon = style({ marginLeft: vars.space.xs, opacity: 0.7 });

export const td = style({
  padding: `${vars.space.xs} ${vars.space.md}`,
  // Без разделителей строк — структуру держат отступы и hover.
  verticalAlign: 'middle',
});

export const row = style({
  transition: 'background .12s ease',
  selectors: { '&:hover': { background: vars.color.bg } },
});

export const rowClickable = style({ cursor: 'pointer' });

export const empty = style({
  padding: vars.space.xl,
  textAlign: 'center',
  color: vars.color.muted,
});

export const checkboxCell = style({ width: 36, paddingLeft: vars.space.md });
