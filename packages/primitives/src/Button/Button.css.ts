import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.xs,
  border: '1px solid transparent',
  borderRadius: vars.radius.md,
  fontFamily: vars.font.family,
  fontWeight: vars.font.weightBold,
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'filter .15s ease, background .15s ease, border-color .15s ease',
  selectors: {
    '&[data-hovered]': { filter: 'brightness(1.08)' },
    '&[data-pressed]': { transform: 'translateY(1px)' },
    '&[data-focus-visible]': { outline: `2px solid ${vars.color.accent}`, outlineOffset: '2px' },
    '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
  },
});

export const variant = styleVariants({
  primary: [base, { background: vars.color.accent, color: vars.color.accentFg }],
  secondary: [base, { background: 'transparent', color: vars.color.fg, borderColor: vars.color.border }],
  ghost: [base, { background: 'transparent', color: vars.color.accent }],
  danger: [base, { background: vars.color.danger, color: '#fff' }],
  // Фирменный градиент fractalUI (teal → green)
  brand: [base, { background: vars.gradient.brand, color: vars.color.accentFg }],
});

export const size = styleVariants({
  sm: { padding: '2px 8px', fontSize: vars.font.sizeSm },
  md: { padding: '4px 10px', fontSize: vars.font.sizeMd },
  lg: { padding: '6px 14px', fontSize: vars.font.sizeLg },
});
