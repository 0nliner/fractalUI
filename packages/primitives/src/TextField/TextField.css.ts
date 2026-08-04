import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  fontFamily: vars.font.family,
});

export const label = style({ fontSize: vars.font.sizeSm, color: vars.color.muted });

export const input = style({
  boxSizing: 'border-box',
  width: '100%',
  background: vars.color.surface,
  color: vars.color.fg,
  border: 'none',
  borderRadius: vars.radius.md,
  padding: '6px 10px',
  fontSize: vars.font.sizeMd,
  fontFamily: vars.font.family,
  transition: 'box-shadow .15s ease',
  // Обводки по умолчанию нет — кольцо появляется только в фокусе/ошибке.
  selectors: {
    '&[data-focused]': { outline: 'none', boxShadow: `inset 0 0 0 1px ${vars.color.accent}` },
    '&[data-invalid]': { boxShadow: `inset 0 0 0 1px ${vars.color.danger}` },
    '&::placeholder': { color: vars.color.muted },
  },
});

export const description = style({ fontSize: vars.font.sizeSm, color: vars.color.muted });
export const errorText = style({ fontSize: vars.font.sizeSm, color: vars.color.danger });
