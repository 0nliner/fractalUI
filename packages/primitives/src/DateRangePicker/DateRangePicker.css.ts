import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

// Поле/календарь переиспользуют стили DatePicker (те же классы) — здесь только
// специфика диапазона: разделитель, кнопки «+ старт» / очистить.

export const sep = style({ color: vars.color.muted, padding: '0 2px' });

export const groupRow = style({ display: 'inline-flex', alignItems: 'center', gap: vars.space.xs });

export const singleWrap = style({ display: 'flex', flexDirection: 'column', gap: vars.space.xs });

export const addBtn = style({
  alignSelf: 'flex-start',
  border: 'none',
  background: 'transparent',
  color: vars.color.accent,
  cursor: 'pointer',
  fontSize: vars.font.sizeSm,
  fontFamily: vars.font.family,
  padding: '2px 0',
});

export const clearBtn = style({
  border: 'none',
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  fontSize: vars.font.sizeMd,
  lineHeight: 1,
  padding: '2px 4px',
  borderRadius: vars.radius.sm,
  selectors: { '&:hover': { color: vars.color.fg } },
});
