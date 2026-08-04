import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  display: 'flex',
  alignItems: 'stretch',
  flexShrink: 0,
  height: 32,
  overflowX: 'auto',
  overflowY: 'hidden',
  borderBottom: `1px solid ${vars.color.border}`,
  background: vars.color.bg,
  fontFamily: vars.font.family,
  // Полосу прокрутки прячем: она съедала бы треть высоты полосы вкладок.
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': { display: 'none' },
  },
});

export const tab = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  flexShrink: 0,
  maxWidth: 220,
  padding: `0 ${vars.space.xs} 0 ${vars.space.sm}`,
  border: 'none',
  borderRight: `1px solid ${vars.color.border}`,
  background: 'transparent',
  color: vars.color.muted,
  fontFamily: 'inherit',
  fontSize: vars.font.sizeSm,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  position: 'relative',
  selectors: {
    '&:hover': { color: vars.color.fg },
    '&[data-active="true"]': {
      background: vars.color.surface,
      color: vars.color.fg,
    },
    // Активную вкладку помечаем полосой сверху, а не заливкой целиком:
    // заливка акцентом рядом с рабочей областью читается как «идёт операция».
    '&[data-active="true"]::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      background: vars.color.accent,
    },
    // Превью — курсивом, как в VS Code: видно, что вкладка временная.
    '&[data-preview="true"]': { fontStyle: 'italic' },
    '&[data-dragging="true"]': { opacity: 0.4 },
    '&[data-drop="true"]': { boxShadow: `inset 2px 0 0 0 ${vars.color.accent}` },
  },
});

export const label = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const icon = style({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
});

export const close = style({
  display: 'inline-grid',
  placeItems: 'center',
  width: 16,
  height: 16,
  flexShrink: 0,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  opacity: 0,
  selectors: {
    // Крестик показываем у активной и при наведении — иначе полоса вкладок
    // пестрит крестиками и читается хуже.
    [`${tab}:hover &, ${tab}[data-active="true"] &`]: { opacity: 0.7 },
    '&:hover': { opacity: 1, background: vars.color.bg },
  },
});

export const menu = style({
  position: 'fixed',
  zIndex: 9999,
  minWidth: 190,
  padding: vars.space.xs,
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.md,
  fontFamily: vars.font.family,
});

export const menuButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  width: '100%',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: vars.color.fg,
  fontFamily: 'inherit',
  fontSize: vars.font.sizeSm,
  textAlign: 'left',
  cursor: 'pointer',
  selectors: {
    '&:hover:not(:disabled)': { background: vars.color.bg },
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
  },
});
