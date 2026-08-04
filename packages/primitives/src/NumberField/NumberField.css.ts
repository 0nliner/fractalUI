import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

/** Число выравнивается по центру: в счётчике количества так читается лучше. */
export const input = style({
  flex: 1,
  minWidth: 0,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'inherit',
  font: 'inherit',
  textAlign: 'center',
  padding: 0,
  // Нативные стрелки Chrome/Safari — свои у нас уже есть.
  MozAppearance: 'textfield',
  selectors: {
    '&::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
    '&::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
    '&::placeholder': { color: vars.color.fgSubtle },
  },
});

export const stepper = style({
  flexShrink: 0,
  // Квадрат по высоте контрола: на мобильной теме сам станет пальцевым.
  width: vars.size.control,
  alignSelf: 'stretch',
  background: 'transparent',
  color: vars.color.muted,
  border: 'none',
  borderRadius: vars.radius.sm,
  fontSize: vars.font.sizeLg,
  lineHeight: 1,
  cursor: 'pointer',
  transition: `background ${vars.motion.fast} ${vars.motion.ease}`,
  selectors: {
    '&[data-hovered]': { background: vars.color.surfaceSunken, color: vars.color.fg },
    '&[data-pressed]': { background: vars.color.surfaceSunken },
    '&[data-focus-visible]': { outline: 'none', boxShadow: vars.shadow.focus },
    '&[data-disabled]': { opacity: 0.4, cursor: 'not-allowed' },
  },
});
