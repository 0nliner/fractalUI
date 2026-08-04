import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const textarea = style({
  boxSizing: 'border-box',
  width: '100%',
  background: vars.color.surface,
  color: vars.color.fg,
  border: 'none',
  borderRadius: vars.radius.md,
  padding: vars.space.md,
  fontSize: vars.font.sizeMd,
  fontFamily: vars.font.family,
  lineHeight: vars.font.lineNormal,
  // Только по вертикали: горизонтальный ресайз ломает сетку формы.
  resize: 'vertical',
  transition: `box-shadow ${vars.motion.fast} ${vars.motion.ease}`,
  selectors: {
    '&[data-focused]': { outline: 'none', boxShadow: vars.shadow.focus },
    '&[data-invalid]': { boxShadow: `inset 0 0 0 1px ${vars.color.danger}` },
    '&[data-disabled]': { opacity: 0.55, cursor: 'not-allowed' },
    '&::placeholder': { color: vars.color.fgSubtle },
  },
});
