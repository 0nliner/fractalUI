import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  background: vars.color.surface,
  fontFamily: vars.font.family,
  color: vars.color.fg,
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  flexShrink: 0,
  height: 40,
  padding: `0 ${vars.space.md}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const title = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: vars.font.sizeMd,
  fontWeight: vars.font.weightBold,
});

export const iconButton = style({
  display: 'inline-grid',
  placeItems: 'center',
  width: 26,
  height: 26,
  flexShrink: 0,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: vars.color.muted,
  fontFamily: 'inherit',
  fontSize: vars.font.sizeSm,
  cursor: 'pointer',
  selectors: {
    '&:hover:not(:disabled)': { background: vars.color.bg, color: vars.color.fg },
    '&[data-active="true"]': { color: vars.color.accent },
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
  },
});

/** Раскрывающаяся полка под шапкой: история и настройки. Панель узкая, второй колонки в ней нет. */
export const shelf = style({
  flexShrink: 0,
  maxHeight: 240,
  overflowY: 'auto',
  borderBottom: `1px solid ${vars.color.border}`,
});

export const shelfPad = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
});

export const convRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  width: '100%',
  padding: `${vars.space.xs} ${vars.space.md}`,
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  fontFamily: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  selectors: {
    '&:hover': { background: vars.color.bg },
    '&[data-active="true"]': {
      background: `color-mix(in srgb, ${vars.color.accent} 10%, transparent)`,
    },
  },
});

export const convTitle = style({
  fontSize: vars.font.sizeSm,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const convMeta = style({
  fontSize: vars.font.sizeSm,
  opacity: 0.7,
  color: vars.color.muted,
});

export const contextLine = style({
  flexShrink: 0,
  padding: `2px ${vars.space.md}`,
  fontSize: vars.font.sizeSm,
  color: vars.color.muted,
  borderBottom: `1px solid ${vars.color.border}`,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const feed = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: vars.space.sm,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const row = style({
  display: 'flex',
  flexDirection: 'column',
  selectors: {
    '&[data-mine="true"]': { alignItems: 'flex-end' },
    '&[data-mine="false"]': { alignItems: 'flex-start' },
  },
});

export const bubble = style({
  maxWidth: '92%',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.lg,
  fontSize: vars.font.sizeMd,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  selectors: {
    '&[data-mine="true"]': {
      background: vars.color.accent,
      color: vars.color.accentFg,
      borderBottomRightRadius: vars.radius.sm,
    },
    '&[data-mine="false"]': {
      background: vars.color.bg,
      border: `1px solid ${vars.color.border}`,
      borderBottomLeftRadius: vars.radius.sm,
    },
  },
});

/** Вызовы инструментов над репликой: видно, что именно агент сделал. */
export const tools = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  marginBottom: vars.space.xs,
  padding: `0 ${vars.space.xs}`,
});

export const tool = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.font.sizeSm,
  color: vars.color.accent,
  selectors: {
    '&[data-status="running"]': { color: vars.color.muted },
    '&[data-status="failed"]': { color: vars.color.danger },
  },
});

export const empty = style({
  margin: 'auto',
  padding: vars.space.lg,
  textAlign: 'center',
  fontSize: vars.font.sizeSm,
  color: vars.color.muted,
});

export const composer = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: vars.space.xs,
  flexShrink: 0,
  padding: vars.space.sm,
  borderTop: `1px solid ${vars.color.border}`,
});

export const input = style({
  flex: 1,
  minWidth: 0,
  minHeight: 36,
  maxHeight: 160,
  resize: 'none',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.bg,
  color: vars.color.fg,
  fontFamily: 'inherit',
  fontSize: vars.font.sizeMd,
  outline: 'none',
  selectors: {
    '&:focus': { borderColor: vars.color.accent },
    '&:disabled': { opacity: 0.5 },
  },
});

export const sendButton = style({
  display: 'inline-grid',
  placeItems: 'center',
  flexShrink: 0,
  width: 36,
  height: 36,
  border: 'none',
  borderRadius: vars.radius.md,
  background: vars.color.accent,
  color: vars.color.accentFg,
  cursor: 'pointer',
  fontFamily: 'inherit',
  selectors: {
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
    '&[data-variant="stop"]': {
      background: vars.color.bg,
      color: vars.color.fg,
      border: `1px solid ${vars.color.border}`,
    },
  },
});

/** Интерактивный блок под сообщением: список действий, выбор, форма. */
export const extra = style({
  marginTop: vars.space.xs,
  alignSelf: 'stretch',
});
