/**
 * Общие стили полей формы.
 *
 * Не компонент: у каждого поля React Aria свой корень (`AriaTextField`,
 * `AriaSelect`, `AriaNumberField`…), и обёртка-шелл ломала бы контекст RAC,
 * через который `Label`, `Text` и `FieldError` находят своё поле. Поэтому
 * общее — только стили, а разметку каждый слайс собирает из частей RAC сам.
 *
 * Здесь же собраны решения, которые обязаны быть одинаковыми у всех полей:
 * высота из `size.control`, кольцо фокуса из `shadow.focus`, красное кольцо
 * при `data-invalid`, приглушённое состояние при `data-disabled`.
 */
import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

/** Корень поля: подпись, контрол, описание/ошибка — колонкой. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  fontFamily: vars.font.family,
});

export const label = style({
  fontSize: vars.font.sizeSm,
  color: vars.color.muted,
});

export const description = style({
  fontSize: vars.font.sizeSm,
  color: vars.color.fgSubtle,
});

export const errorText = style({
  fontSize: vars.font.sizeSm,
  color: vars.color.danger,
});

/**
 * Базовый вид контрола: инпут, кнопка селекта, группа NumberField.
 * Высота — токеном: продукт с крупной плотностью (витрина, мобильный) ставит
 * `size.control: 44px` темой и не форкает компоненты.
 */
export const control = style({
  boxSizing: 'border-box',
  width: '100%',
  minHeight: vars.size.control,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  background: vars.color.surface,
  color: vars.color.fg,
  border: 'none',
  borderRadius: vars.radius.md,
  padding: `0 ${vars.space.md}`,
  fontSize: vars.font.sizeMd,
  fontFamily: vars.font.family,
  textAlign: 'left',
  cursor: 'default',
  transition: `box-shadow ${vars.motion.fast} ${vars.motion.ease}, background ${vars.motion.fast} ${vars.motion.ease}`,
  // Обводки по умолчанию нет — кольцо появляется только в фокусе/ошибке.
  selectors: {
    '&[data-hovered]': { background: vars.color.surfaceHover },
    '&[data-focused]': { outline: 'none', boxShadow: vars.shadow.focus },
    '&[data-focus-visible]': { outline: 'none', boxShadow: vars.shadow.focus },
    '&[data-invalid]': { boxShadow: `inset 0 0 0 1px ${vars.color.danger}` },
    '&[data-disabled]': { opacity: 0.55, cursor: 'not-allowed' },
    '&::placeholder': { color: vars.color.fgSubtle },
  },
});

/** Голый input внутри составного контрола (NumberField, ComboBox). */
export const bareInput = style({
  flex: 1,
  minWidth: 0,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'inherit',
  font: 'inherit',
  padding: 0,
  selectors: {
    '&::placeholder': { color: vars.color.fgSubtle },
  },
});

/** Всплывающая панель: списки селекта, комбобокса, меню. */
export const popover = style({
  background: vars.color.surface,
  color: vars.color.fg,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.lg,
  padding: vars.space.xs,
  // Ширина по триггеру: RAC отдаёт её этой переменной.
  minWidth: 'var(--trigger-width)',
  maxHeight: 320,
  overflowY: 'auto',
  zIndex: vars.z.popover,
});

/** Пункт списка/меню. */
export const option = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  minHeight: vars.size.control,
  padding: `0 ${vars.space.md}`,
  borderRadius: vars.radius.sm,
  fontSize: vars.font.sizeMd,
  cursor: 'default',
  outline: 'none',
  selectors: {
    '&[data-focused]': { background: vars.color.surfaceHover },
    '&[data-hovered]': { background: vars.color.surfaceHover },
    '&[data-selected]': { color: vars.color.accent, fontWeight: vars.font.weightMedium },
    '&[data-disabled]': { opacity: 0.55 },
  },
});
