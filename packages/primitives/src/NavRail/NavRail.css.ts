import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

/**
 * Навигационный рейл 48px — «плавающая» стеклянная панель только с иконками.
 * Экономия пространства: подписи живут в тултипах, пункты раздела — во флайауте,
 * поэтому рейл НИКОГДА не меняет ширину и рабочая область не дёргается.
 */
export const rail = style({
  position: 'relative',
  zIndex: 30,
  width: 48,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  padding: `${vars.space.xs} 0`,
  borderRadius: vars.radius.lg,
  background: vars.color.surface,
  boxShadow: vars.shadow.md,
  // Рамка в стеклянном режиме прибавляется к ширине — фиксируем модель,
  // иначе рейл перестаёт быть ровно 48px.
  boxSizing: 'border-box',
});

/**
 * Полупрозрачное «стекло» — поверх анимированного фона (LavaLamp).
 *
 * Стекло — это ПРОЗРАЧНЫЙ фон плюс размытие. Один только `backdrop-filter`
 * поверх непрозрачной поверхности не виден вообще: размывать нечего, и рейл
 * выглядит обычной панелью. Прозрачность даёт `color-mix` по токену
 * поверхности, а не `opacity`: та гасит вместе с фоном и сами иконки.
 */
export const railGlass = style({
  background: `color-mix(in srgb, ${vars.color.surface} 60%, transparent)`,
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: `1px solid ${vars.color.border}`,
});

export const spacer = style({ marginTop: 'auto' });

export const group = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
});

const buttonBase = style({
  position: 'relative',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  cursor: 'pointer',
  borderRadius: vars.radius.md,
  background: 'transparent',
  color: vars.color.muted,
  transition: 'color .12s, background .12s',
  selectors: {
    '&[data-hovered]': { color: vars.color.fg, background: vars.color.bg },
    '&[data-focus-visible]': { outline: `2px solid ${vars.color.accent}`, outlineOffset: 2 },
  },
});

export const button = styleVariants({
  idle: [buttonBase],
  active: [
    buttonBase,
    {
      color: vars.color.accent,
      background: vars.color.bg,
    },
  ],
});

/** Счётчик в правом верхнем углу кнопки. */
export const badge = style({
  position: 'absolute',
  top: 2,
  right: 2,
  minWidth: 14,
  height: 14,
  padding: '0 2px',
  borderRadius: vars.radius.full,
  background: vars.color.accent,
  color: vars.color.accentFg,
  fontFamily: vars.font.family,
  fontSize: 9,
  fontWeight: vars.font.weightBold,
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
