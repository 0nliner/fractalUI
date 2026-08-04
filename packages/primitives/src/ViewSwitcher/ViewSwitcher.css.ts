import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

/**
 * Плавающая пилюля с чипами режимов.
 *
 * Позиционирование намеренно `absolute`, а не `fixed`: у приложения могут быть
 * свои постоянные зоны по краям экрана (рейл, док), и пилюля во всю ширину окна
 * на них наезжает. Родитель обязан быть `position: relative`.
 */
export const root = style({
  position: 'absolute',
  left: '50%',
  bottom: vars.space.md,
  transform: 'translateX(-50%)',
  zIndex: 20,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  maxWidth: 'calc(100% - 24px)',
  overflowX: 'auto',
  padding: vars.space.xs,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  // Прозрачный фон + размытие. Непрозрачная поверхность с `backdrop-filter`
  // выглядит обычной панелью: размывать под ней нечего, а пилюля висит
  // прямо над рабочей областью и должна её просвечивать.
  background: `color-mix(in srgb, ${vars.color.surface} 72%, transparent)`,
  boxShadow: vars.shadow.md,
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  fontFamily: vars.font.family,
  // Полосу прокрутки прячем: чипов единицы, а полоса ломает высоту пилюли.
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': { display: 'none' },
  },
});

export const chip = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  flexShrink: 0,
  height: 28,
  padding: `0 ${vars.space.sm}`,
  borderRadius: vars.radius.md,
  // Активный чип отличается рамкой и цветом текста, а не заливкой: заливка
  // акцентом рядом с канвасом читается как «идёт операция».
  border: '1px solid transparent',
  background: vars.color.bg,
  color: vars.color.muted,
  fontFamily: 'inherit',
  fontSize: vars.font.sizeSm,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'color .12s ease, border-color .12s ease',
  selectors: {
    '&:hover:not(:disabled)': { color: vars.color.fg },
    '&[data-active="true"]': {
      borderColor: vars.color.accent,
      color: vars.color.fg,
    },
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
  },
});

export const hint = style({
  flexShrink: 0,
  paddingLeft: vars.space.xs,
  paddingRight: vars.space.xs,
  color: vars.color.muted,
  fontSize: vars.font.sizeSm,
  opacity: 0.7,
  whiteSpace: 'nowrap',
});
