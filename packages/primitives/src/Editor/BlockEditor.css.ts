import { globalStyle, keyframes, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

export const root = style({
  position: 'relative',
  width: '100%',
  minHeight: 48,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeMd,
  lineHeight: 1.55,
  color: vars.color.fg,
});

/**
 * Контейнер в режиме плиток: 12-колоночная сетка. `gridAutoRows` даёт единицу
 * ряда для rowSpan-снапа. На узком экране сетка схлопывается в одну колонку.
 */
export const gridRoot = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
  gridAutoRows: 'minmax(40px, auto)',
  gap: vars.space.sm,
  // stretch (не start!): плитка заполняет отведённые rowSpan-ряды, иначе высота
  // «схлопывается» к контенту и изменение rowSpan не видно.
  alignItems: 'stretch',
  '@media': {
    '(max-width: 640px)': { gridTemplateColumns: '1fr' },
  },
});

/** Подсветка зоны, куда можно бросить файл. */
export const dropZone = style({
  position: 'absolute',
  inset: 0,
  zIndex: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  borderRadius: vars.radius.md,
  border: `1px dashed ${vars.color.accent}`,
  background: vars.color.overlay,
  color: vars.color.accent,
  fontSize: vars.font.sizeSm,
  pointerEvents: 'none',
});

export const row = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'flex-start',
  width: '100%',
  marginBottom: 1,
  borderRadius: vars.radius.sm,
  selectors: {
    '&[data-selected="true"]': {
      background: vars.color.surface,
      boxShadow: `inset 0 0 0 1px ${vars.color.accent}`,
    },
    '&[data-dragging="true"]': { opacity: 0.4 },
    '&[data-drop="top"]': { boxShadow: `inset 0 2px 0 0 ${vars.color.accent}` },
    '&[data-drop="bottom"]': { boxShadow: `inset 0 -2px 0 0 ${vars.color.accent}` },
  },
});

/**
 * Плитка на сетке: геометрию задаём CSS-переменными (их пишет BlockRow из
 * `block.layout`), а НЕ сырым inline `gridColumn` — иначе media-запрос ниже не
 * смог бы схлопнуть плитки в одну колонку на мобиле (inline перекрывает media).
 * Тот же класс работает в readOnly (паритет вьюера).
 */
export const gridCell = style({
  gridColumn: 'var(--tile-col, auto) / span var(--tile-col-span, 12)',
  gridRow: 'var(--tile-row, auto) / span var(--tile-row-span, 1)',
  marginBottom: 0,
  minWidth: 0,
  selectors: {
    // Контур соседних плиток, пока какая-то плитка выбрана: СПЛОШНОЙ и чуть ярче
    // направляющих сетки (accent ~50% против ~35% у гайдов).
    '&[data-tile-peer="true"]': {
      outline: `1px solid color-mix(in srgb, ${vars.color.accent} 50%, transparent)`,
      outlineOffset: -1,
      borderRadius: vars.radius.sm,
    },
  },
  '@media': {
    '(max-width: 640px)': {
      gridColumn: '1 / -1 !important',
      gridRow: 'auto !important',
    },
  },
});

/**
 * Направляющие сетки (12 колонок), видны пока выбрана плитка. Абсолютный оверлей
 * с ТЕМ ЖЕ template/gap, что gridRoot — колонки совпадают. Кликов не ловит.
 */
export const guideOverlay = style({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
  display: 'grid',
  gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
  // Один ряд во всю высоту — иначе пустые колонки-направляющие имеют высоту 0.
  gridTemplateRows: '1fr',
  gap: vars.space.sm,
  '@media': {
    '(max-width: 640px)': { display: 'none' },
  },
});

export const guideCol = style({
  border: `1px dashed ${vars.color.accent}`,
  borderRadius: vars.radius.sm,
  opacity: 0.35,
});

/** Прокручиваемая область плитки: высота = rowSpan-область, контент скроллится. */
export const contentScroll = style({
  // Единица ряда 40px + gap (= LayoutHandles.rowStep), минус один gap на стыки.
  maxHeight: `calc(var(--tile-row-span, 1) * (40px + ${vars.space.sm}) - ${vars.space.sm})`,
  selectors: {
    '&[data-scroll="y"]': { overflowY: 'auto', overflowX: 'hidden' },
    '&[data-scroll="x"]': { overflowX: 'auto', overflowY: 'hidden' },
    '&[data-scroll="both"]': { overflow: 'auto' },
  },
});

/** Оверлей выбранной плитки: primary-контур; сам по себе кликов не ловит. */
export const tileOverlay = style({
  position: 'absolute',
  inset: -2,
  pointerEvents: 'none',
  borderRadius: vars.radius.sm,
  outline: `2px solid ${vars.color.accent}`,
  zIndex: 15,
  selectors: {
    // Залоченная плитка — приглушённый контур (ресайз недоступен).
    '&[data-locked="true"]': { outline: `2px solid ${vars.color.muted}` },
  },
});

/** Круглая ручка ресайза (стиль «нового Android»). */
export const tileHandle = style({
  position: 'absolute',
  width: 14,
  height: 14,
  padding: 0,
  border: `2px solid ${vars.color.bg}`,
  borderRadius: '50%',
  background: vars.color.accent,
  boxShadow: vars.shadow.sm,
  pointerEvents: 'auto',
  touchAction: 'none',
});

/** Позиция ручки на центре грани + курсор ресайза. */
export const handleEdge = styleVariants({
  top: { top: -7, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
  bottom: { bottom: -7, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
  left: { left: -7, top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
  right: { right: -7, top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
});

// ── Тулбар под выбранной плиткой ────────────────────────────────────────────

export const tileToolbar = style({
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  zIndex: 16,
  pointerEvents: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  padding: 3,
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.md,
  fontFamily: vars.font.family,
});

export const tileToolbarBtn = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  minWidth: 26,
  height: 26,
  padding: '0 6px',
  border: 'none',
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  borderRadius: vars.radius.sm,
  fontSize: vars.font.sizeSm,
  fontFamily: vars.font.family,
  selectors: {
    '&:hover': { color: vars.color.fg, background: vars.color.bg },
    '&[data-active="true"]': { color: vars.color.accentFg, background: vars.color.accent },
    '&[data-danger="true"]:hover': { color: vars.color.danger, background: vars.color.bg },
    // Мгновенный CSS-тултип (без задержки браузера): показывается сразу на hover.
    '&[data-tip]:hover::after': {
      content: 'attr(data-tip)',
      position: 'absolute',
      bottom: 'calc(100% + 7px)',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '5px 8px',
      background: vars.color.fg,
      color: vars.color.bg,
      borderRadius: vars.radius.sm,
      fontSize: vars.font.sizeSm,
      lineHeight: 1.3,
      whiteSpace: 'normal',
      width: 'max-content',
      maxWidth: 220,
      textAlign: 'center',
      boxShadow: vars.shadow.md,
      zIndex: 30,
      pointerEvents: 'none',
    },
    '&[data-tip]:hover::before': {
      content: '""',
      position: 'absolute',
      bottom: 'calc(100% + 2px)',
      left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: `5px solid ${vars.color.fg}`,
      zIndex: 30,
      pointerEvents: 'none',
    },
  },
});

/** Ручка перемещения плитки (drag-and-drop, как в Android): верхний-левый угол. */
export const tileMoveHandle = style({
  position: 'absolute',
  top: -9,
  left: -9,
  zIndex: 16,
  width: 20,
  height: 20,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: `2px solid ${vars.color.bg}`,
  borderRadius: '50%',
  background: vars.color.accent,
  color: vars.color.accentFg,
  boxShadow: vars.shadow.sm,
  cursor: 'grab',
  touchAction: 'none',
  pointerEvents: 'auto',
  selectors: {
    '&[data-moving="true"]': { cursor: 'grabbing' },
    '&[data-tip]:hover::after': {
      content: 'attr(data-tip)',
      position: 'absolute',
      bottom: 'calc(100% + 7px)',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '5px 8px',
      background: vars.color.fg,
      color: vars.color.bg,
      borderRadius: vars.radius.sm,
      fontSize: vars.font.sizeSm,
      lineHeight: 1.3,
      whiteSpace: 'normal',
      width: 'max-content',
      maxWidth: 200,
      textAlign: 'center',
      boxShadow: vars.shadow.md,
      zIndex: 30,
      pointerEvents: 'none',
    },
  },
});

export const tileToolbarSep = style({
  width: 1,
  alignSelf: 'stretch',
  margin: '2px 3px',
  background: vars.color.border,
});

/** Мини-дропдаун осей прокрутки. */
export const scrollMenu = style({
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  zIndex: 17,
  minWidth: 150,
  padding: 4,
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.md,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

export const scrollMenuItem = style({
  textAlign: 'left',
  border: 'none',
  background: 'transparent',
  color: vars.color.fg,
  cursor: 'pointer',
  fontSize: vars.font.sizeSm,
  fontFamily: vars.font.family,
  padding: '5px 8px',
  borderRadius: vars.radius.sm,
  selectors: {
    '&:hover': { background: vars.color.bg },
    '&[data-active="true"]': { color: vars.color.accent, fontWeight: vars.font.weightBold },
  },
});

/** Тонкий тулбар редактора (кнопка «На весь экран»). */
export const toolbar = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.xs,
  paddingBottom: vars.space.xs,
  marginBottom: vars.space.xs,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const toolbarBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  border: 'none',
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  fontSize: vars.font.sizeSm,
  fontFamily: vars.font.family,
  padding: '4px 8px',
  borderRadius: vars.radius.sm,
  selectors: {
    '&:hover': { color: vars.color.accent, background: vars.color.surface },
  },
});

/** Полноэкранный оверлей редактора (портал в body). */
export const fullscreenOverlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  background: vars.color.bg,
  color: vars.color.fg,
  overflow: 'auto',
  padding: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
});

/** Ручка перетаскивания и вызова меню блока. */
export const grip = style({
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
  width: 16,
  height: 20,
  marginTop: 2,
  marginRight: vars.space.xs,
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: vars.color.muted,
  // Ручка появляется по наведению: иначе слева от каждой строки висит серый
  // столбик и текст перестаёт читаться как текст.
  opacity: 0,
  cursor: 'grab',
  touchAction: 'none',
  selectors: {
    [`${row}:hover &`]: { opacity: 1 },
    '&:focus-visible': { opacity: 1, outline: `1px solid ${vars.color.accent}` },
    '&:hover': { color: vars.color.fg, background: vars.color.bg },
  },
});

export const content = style({
  flex: 1,
  minWidth: 0,
});

/** Полоса «кликни, чтобы дописать» под последним блоком. */
export const addArea = style({
  minHeight: 26,
  padding: `${vars.space.xs} 0`,
  color: vars.color.muted,
  fontSize: vars.font.sizeSm,
  cursor: 'text',
  userSelect: 'none',
});

// ── Текстовые блоки ─────────────────────────────────────────────────────────

export const field = style({
  display: 'block',
  width: '100%',
  margin: 0,
  padding: 0,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  lineHeight: 'inherit',
  resize: 'none',
  overflow: 'hidden',
});

export const view = style({
  minHeight: '1.4em',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  cursor: 'text',
  selectors: {
    '&[data-empty="true"]': { color: vars.color.muted },
    '&[data-readonly="true"]': { cursor: 'default' },
  },
});

export const heading = styleVariants({
  1: { fontSize: '20px', fontWeight: vars.font.weightBold, lineHeight: 1.3, margin: '8px 0 2px' },
  2: { fontSize: '16px', fontWeight: vars.font.weightBold, lineHeight: 1.35, margin: '6px 0 2px' },
  3: { fontSize: '14px', fontWeight: vars.font.weightBold, lineHeight: 1.4, margin: '4px 0 2px' },
});

export const quote = style({
  borderLeft: `2px solid ${vars.color.accent}`,
  paddingLeft: vars.space.sm,
  fontStyle: 'italic',
});

export const inlineRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space.xs,
});

/** Текст рядом с маркером/чекбоксом должен занимать всю оставшуюся ширину. */
export const grow = style({
  flex: 1,
  minWidth: 0,
});

export const marker = style({
  flexShrink: 0,
  minWidth: 14,
  color: vars.color.muted,
  fontSize: vars.font.sizeSm,
  lineHeight: '1.7',
  textAlign: 'right',
  userSelect: 'none',
});

/** Маленькая ghost-кнопка: чекбокс to-do, стрелка toggle, крестики таблицы. */
export const iconButton = style({
  display: 'inline-grid',
  placeItems: 'center',
  flexShrink: 0,
  padding: 2,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  selectors: {
    '&:hover': { color: vars.color.fg, background: vars.color.bg },
    '&[data-checked="true"]': { color: vars.color.accent },
    '&:disabled': { opacity: 0.5, cursor: 'default' },
  },
});

export const struck = style({
  textDecoration: 'line-through',
  opacity: 0.6,
});

export const toggleChildren = style({
  marginLeft: 22,
  marginTop: 2,
  color: vars.color.muted,
  fontSize: vars.font.sizeSm,
});

export const divider = style({
  height: 1,
  margin: `${vars.space.sm} 0`,
  background: vars.color.border,
});

// ── Код и формула ───────────────────────────────────────────────────────────

export const codeBox = style({
  padding: vars.space.sm,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  fontSize: vars.font.sizeSm,
});

export const codeLang = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  marginBottom: vars.space.xs,
  color: vars.color.muted,
  fontSize: '10px',
  userSelect: 'none',
});

export const pre = style({
  margin: 0,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontFamily: 'inherit',
  fontSize: 'inherit',
});

export const formulaBox = style({
  overflowX: 'auto',
  padding: `${vars.space.xs} 0`,
});

export const formulaRaw = style({
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  fontSize: vars.font.sizeSm,
  color: vars.color.fg,
});

// ── Таблица ─────────────────────────────────────────────────────────────────

export const tableWrap = style({
  position: 'relative',
  overflowX: 'auto',
  margin: `${vars.space.xs} 0`,
});

export const table = style({
  borderCollapse: 'collapse',
  width: '100%',
  fontSize: vars.font.sizeSm,
});

export const cell = style({
  position: 'relative',
  minWidth: 56,
  padding: '3px 6px',
  border: `1px solid ${vars.color.border}`,
  verticalAlign: 'top',
  selectors: {
    '&[data-head="true"]': {
      background: vars.color.surface,
      fontWeight: vars.font.weightBold,
    },
  },
});

export const cellInput = style({
  width: '100%',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  fontWeight: 'inherit',
  textAlign: 'inherit',
});

export const gutterCell = style({
  width: 18,
  padding: 0,
  border: 'none',
});

// Крестики удаления строк и колонок показываем только при наведении на
// таблицу: постоянный ряд крестиков забивает и без того плотную сетку.
globalStyle(`${gutterCell} button`, { opacity: 0 });
globalStyle(`${tableWrap}:hover ${gutterCell} button`, { opacity: 1 });
globalStyle(`${gutterCell} button:focus-visible`, { opacity: 1 });

export const ghostButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: '2px 6px',
  border: `1px dashed ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: vars.color.muted,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  cursor: 'pointer',
  selectors: {
    '&:hover:not(:disabled)': { color: vars.color.fg, borderColor: vars.color.accent },
    '&:disabled': { opacity: 0.5, cursor: 'default' },
  },
});

export const tableTools = style({
  display: 'flex',
  gap: vars.space.xs,
  marginTop: vars.space.xs,
});

/** Панель выравнивания колонки (появляется под ячейкой-заголовком). */
export const alignBar = style({
  display: 'inline-flex',
  gap: 2,
  justifyContent: 'center',
});

export const alignBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  padding: 2,
  borderRadius: vars.radius.sm,
  selectors: {
    '&:hover': { color: vars.color.fg, background: vars.color.bg },
    '&[data-active="true"]': { color: vars.color.accentFg, background: vars.color.accent },
  },
});

// ── Медиа ───────────────────────────────────────────────────────────────────

export const image = style({
  display: 'block',
  maxWidth: '100%',
  maxHeight: 360,
  borderRadius: vars.radius.md,
  cursor: 'zoom-in',
  selectors: {
    '&[data-zoomable="false"]': { cursor: 'default' },
  },
});

export const fileLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  maxWidth: '100%',
  padding: '4px 8px',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: vars.color.surface,
  color: vars.color.fg,
  fontSize: vars.font.sizeSm,
  textDecoration: 'none',
  selectors: {
    '&:hover': { borderColor: vars.color.accent },
  },
});

export const error = style({
  marginLeft: vars.space.xs,
  color: vars.color.danger,
  fontSize: vars.font.sizeSm,
});

export const hint = style({
  color: vars.color.muted,
  fontSize: vars.font.sizeSm,
});

export const busy = style({
  display: 'inline-flex',
  animation: `${spin} 1s linear infinite`,
});

// ── Ссылка на страницу ──────────────────────────────────────────────────────

export const pageLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  maxWidth: '100%',
  color: vars.color.accent,
  cursor: 'pointer',
  borderBottom: `1px solid ${vars.color.accent}`,
  selectors: {
    // Битая ссылка помечается пунктиром, а не красным: красный на странице
    // читается как ошибка сохранения.
    '&[data-dead="true"]': {
      color: vars.color.muted,
      borderBottomStyle: 'dashed',
      borderBottomColor: vars.color.muted,
      cursor: 'default',
    },
  },
});

export const pickerAnchor = style({
  position: 'relative',
});

export const pickerButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  width: '100%',
  padding: '3px 6px',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: vars.color.surface,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  textAlign: 'left',
  cursor: 'pointer',
});

export const picker = style({
  position: 'absolute',
  zIndex: 30,
  top: '100%',
  left: 0,
  right: 0,
  marginTop: 2,
  maxHeight: 220,
  overflowY: 'auto',
  padding: vars.space.xs,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  boxShadow: vars.shadow.md,
});

export const pickerSearch = style({
  width: '100%',
  marginBottom: vars.space.xs,
  padding: '3px 6px',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: vars.color.bg,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  outline: 'none',
});

// ── Меню (портал в body) ────────────────────────────────────────────────────

export const menu = style({
  position: 'fixed',
  zIndex: 9999,
  minWidth: 190,
  maxWidth: 320,
  maxHeight: 340,
  overflowY: 'auto',
  padding: vars.space.xs,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  boxShadow: vars.shadow.md,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
});

export const menuRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  width: '100%',
  padding: '4px 6px',
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: 'inherit',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  selectors: {
    '&[data-active="true"], &:hover': { background: vars.color.bg },
    '&[data-danger="true"]': { color: vars.color.danger },
    '&[data-current="true"]': { color: vars.color.accent },
  },
});

export const menuIcon = style({
  display: 'inline-flex',
  flexShrink: 0,
  color: vars.color.muted,
});

export const menuLabel = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const menuDesc = style({
  flexShrink: 0,
  color: vars.color.muted,
  fontSize: '10px',
});
