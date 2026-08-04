import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  // Занимаем всю высоту, которую дал контейнер. Без этого корень растёт по
  // содержимому, список внутри никогда не получает ограниченной высоты — и
  // `overflowY: auto` у него не срабатывает: дерево просто обрезается по краю
  // панели и не прокручивается.
  height: '100%',
  minHeight: 0,
  fontFamily: vars.font.family,
  color: vars.color.fg,
});

export const search = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderBottom: `1px solid ${vars.color.border}`,
  flexShrink: 0,
});

export const searchInput = style({
  flex: 1,
  minWidth: 0,
  border: 'none',
  background: 'transparent',
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  outline: 'none',
});

export const list = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: vars.space.xs,
});

/** Строка узла. Высота фиксирована — дерево должно быть плотным. */
export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  width: '100%',
  minHeight: 26,
  padding: `0 ${vars.space.xs}`,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: 'inherit',
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background .1s ease',
  selectors: {
    '&:hover': { background: vars.color.bg },
    '&[data-selected="true"]': {
      background: vars.color.accent,
      color: vars.color.accentFg,
    },
    '&[data-checked="true"]:not([data-selected="true"])': { background: vars.color.bg },
    '&[data-drop="inside"]': { outline: `2px solid ${vars.color.accent}`, outlineOffset: -2 },
    '&[data-drop="before"]': { boxShadow: `inset 0 2px 0 0 ${vars.color.accent}` },
    '&[data-drop="after"]': { boxShadow: `inset 0 -2px 0 0 ${vars.color.accent}` },
    '&[data-dragging="true"]': { opacity: 0.4 },
  },
});

/** Раскрывашка. Занимает место всегда, иначе листья «съезжают» по горизонтали. */
export const switcher = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  flexShrink: 0,
  border: 'none',
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  padding: 0,
});

export const switcherPlaceholder = style({ width: 16, flexShrink: 0 });

export const icon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  flexShrink: 0,
  color: vars.color.muted,
});

export const label = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const match = style({
  background: vars.color.accent,
  color: vars.color.accentFg,
  borderRadius: 2,
});

export const meta = style({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  color: vars.color.muted,
  fontSize: vars.font.sizeSm,
});

export const renameInput = style({
  flex: 1,
  minWidth: 0,
  border: `1px solid ${vars.color.accent}`,
  borderRadius: vars.radius.sm,
  background: vars.color.surface,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  padding: `0 ${vars.space.xs}`,
  outline: 'none',
});

export const checkbox = style({
  width: 13,
  height: 13,
  flexShrink: 0,
  accentColor: vars.color.accent,
  cursor: 'pointer',
});

export const empty = style({
  padding: vars.space.lg,
  textAlign: 'center',
  color: vars.color.muted,
  fontSize: vars.font.sizeSm,
});

/** Контекстное меню: позиционируется по курсору порталом в body. */
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

export const menuItem = styleVariants({
  normal: {},
  danger: {},
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
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  textAlign: 'left',
  cursor: 'pointer',
  selectors: {
    '&:hover:not(:disabled)': { background: vars.color.bg },
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
    '&[data-danger="true"]': { color: vars.color.danger },
  },
});

export const menuShortcut = style({
  marginLeft: 'auto',
  color: vars.color.muted,
  fontSize: vars.font.sizeSm,
  opacity: 0.7,
});

export const menuDivider = style({
  height: 1,
  margin: `${vars.space.xs} 0`,
  background: vars.color.border,
});

/** Подтверждение удаления живёт в самом меню — модалок в ките нет. */
export const confirmRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.xs} ${vars.space.sm}`,
});

export const confirmButton = style({
  border: 'none',
  borderRadius: vars.radius.sm,
  background: vars.color.danger,
  color: vars.color.accentFg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  padding: `2px ${vars.space.sm}`,
  cursor: 'pointer',
});

/** Подменю контекстного меню: вправо от родительского пункта. */
export const submenu = style({
  position: 'absolute',
  top: -4,
  left: '100%',
  minWidth: 170,
  padding: vars.space.xs,
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.md,
  zIndex: 1,
});

// ── Фасетный фильтр ──────────────────────────────────────────────────
/** Кнопка-иконка фильтра справа от поиска. */
export const filterButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  flexShrink: 0,
  marginLeft: 'auto',
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  padding: 0,
  selectors: {
    '&:hover': { color: vars.color.fg, background: vars.color.bg },
    '&[data-active="true"]': { color: vars.color.accent },
  },
});

/** Панель фильтров — раскрывается под строкой поиска. */
export const filterPanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  padding: vars.space.sm,
  borderBottom: `1px solid ${vars.color.border}`,
  flexShrink: 0,
});

export const facetPills = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.xs,
});

export const facetPill = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `2px ${vars.space.sm}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.full,
  background: vars.color.bg,
  color: vars.color.muted,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  cursor: 'pointer',
  transition: 'background .1s ease, color .1s ease, border-color .1s ease',
  selectors: {
    '&:hover': { color: vars.color.fg, borderColor: vars.color.muted },
    '&[data-on="true"]': {
      background: vars.color.accent,
      color: vars.color.accentFg,
      borderColor: 'transparent',
    },
  },
});

export const facetReset = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  width: 22,
  height: 22,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  padding: 0,
  selectors: { '&:hover': { color: vars.color.danger, background: vars.color.bg } },
});

export const tagFacet = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

export const tagChips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
});

export const tagChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `2px ${vars.space.xs} 2px ${vars.space.sm}`,
  borderRadius: vars.radius.sm,
  background: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  color: vars.color.fg,
  fontSize: vars.font.sizeSm,
});

export const tagChipRemove = style({
  display: 'inline-flex',
  border: 'none',
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  padding: 0,
  selectors: { '&:hover': { color: vars.color.danger } },
});

export const tagInputWrap = style({ position: 'relative' });

export const tagInput = style({
  width: '100%',
  boxSizing: 'border-box',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: vars.color.surface,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  outline: 'none',
  selectors: {
    '&::placeholder': { color: vars.color.muted },
    '&:focus': { borderColor: vars.color.muted },
  },
});

export const suggest = style({
  position: 'absolute',
  top: 'calc(100% + 3px)',
  left: 0,
  right: 0,
  zIndex: 60,
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
  boxShadow: vars.shadow.md,
});

export const suggestItem = style({
  display: 'block',
  width: '100%',
  textAlign: 'left',
  border: 'none',
  background: 'transparent',
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  cursor: 'pointer',
  selectors: { '&:hover': { background: vars.color.bg } },
});

/** Группа фасета с подписью (напр. «Тип объекта», «Теги»). */
export const facetGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

export const facetGroupLabel = style({
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  color: vars.color.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
});
