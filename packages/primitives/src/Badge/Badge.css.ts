import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `2px ${vars.space.sm}`,
  borderRadius: vars.radius.full,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  fontWeight: vars.font.weightBold,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
});

export const tone = styleVariants({
  accent: [base, { background: vars.color.accent, color: vars.color.accentFg }],
  muted: [base, { background: vars.color.border, color: vars.color.fg }],
  danger: [base, { background: vars.color.danger, color: '#fff' }],
  brand: [base, { background: vars.gradient.brand, color: vars.color.accentFg }],
});
