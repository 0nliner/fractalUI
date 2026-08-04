import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  fontFamily: vars.font.family,
});

export const label = style({ fontSize: vars.font.sizeSm, color: vars.color.muted });

/** Поле с сегментами даты (mm/dd/yyyy) + кнопка-триггер календаря. */
export const group = style({
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  background: vars.color.surface,
  color: vars.color.fg,
  borderRadius: vars.radius.md,
  padding: '5px 8px',
  fontSize: vars.font.sizeMd,
  transition: 'box-shadow .15s ease',
  selectors: {
    '&[data-focus-within]': { outline: 'none', boxShadow: `inset 0 0 0 1px ${vars.color.accent}` },
    '&[data-invalid]': { boxShadow: `inset 0 0 0 1px ${vars.color.danger}` },
    '&[data-disabled]': { opacity: 0.55 },
  },
});

export const dateInput = style({ display: 'inline-flex', padding: 0, whiteSpace: 'nowrap' });

export const segment = style({
  padding: '0 1px',
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'center',
  color: vars.color.fg,
  borderRadius: vars.radius.sm,
  outline: 'none',
  selectors: {
    '&[data-type="literal"]': { color: vars.color.muted, padding: '0' },
    '&[data-placeholder]': { color: vars.color.muted },
    '&[data-focused]': { background: vars.color.accent, color: vars.color.accentFg },
  },
});

export const trigger = style({
  marginLeft: 6,
  border: 'none',
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  padding: 2,
  borderRadius: vars.radius.sm,
  display: 'inline-flex',
  selectors: {
    '&[data-hovered]': { color: vars.color.fg },
    '&[data-pressed]': { color: vars.color.accent },
  },
});

export const popover = style({
  background: vars.color.surface,
  color: vars.color.fg,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.md,
  padding: vars.space.sm,
  fontFamily: vars.font.family,
});

export const dialog = style({ outline: 'none' });

export const calHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: vars.space.xs,
  gap: vars.space.xs,
});

export const calNav = style({
  border: 'none',
  background: 'transparent',
  color: vars.color.fg,
  cursor: 'pointer',
  padding: '2px 6px',
  borderRadius: vars.radius.sm,
  fontSize: vars.font.sizeMd,
  selectors: {
    '&[data-hovered]': { background: vars.color.bg },
    '&[data-disabled]': { color: vars.color.muted, cursor: 'default' },
  },
});

export const calHeading = style({ fontSize: vars.font.sizeMd, fontWeight: vars.font.weightBold });

export const grid = style({ borderCollapse: 'collapse' });

export const gridHeaderCell = style({
  fontSize: vars.font.sizeSm,
  color: vars.color.muted,
  fontWeight: vars.font.weightRegular,
  padding: 4,
  textAlign: 'center',
});

export const cell = style({
  boxSizing: 'border-box',
  width: 34,
  height: 32,
  textAlign: 'center',
  verticalAlign: 'middle',
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  fontSize: vars.font.sizeSm,
  color: vars.color.fg,
  outline: 'none',
  selectors: {
    '&[data-outside-month]': { color: vars.color.muted, opacity: 0.5 },
    '&[data-hovered]': { background: vars.color.bg },
    '&[data-today]:not([data-selected])': { boxShadow: `inset 0 0 0 1px ${vars.color.border}` },
    '&[data-selected]': { background: vars.color.accent, color: vars.color.accentFg },
    '&[data-selection-start]': { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
    '&[data-selection-end]': { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
    '&[data-disabled]': { color: vars.color.muted, cursor: 'default' },
    '&[data-unavailable]': { color: vars.color.muted, textDecoration: 'line-through', cursor: 'default' },
    '&[data-focus-visible]': { outline: `2px solid ${vars.color.accent}`, outlineOffset: -2 },
  },
});
