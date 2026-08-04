import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.45 },
});

/**
 * Примитивы wireframe-макетов («болванки»).
 *
 * Метод: в макете НЕТ работающих элементов — ни настоящих инпутов, ни реального
 * контента. Только серые заглушки. Так на ревью обсуждают структуру экрана,
 * а не шрифты и формулировки.
 */

/** Серая заливка болванки — производная от muted, работает в обеих темах. */
const fill = `color-mix(in srgb, ${vars.color.muted} 34%, transparent)`;
const fillStrong = `color-mix(in srgb, ${vars.color.muted} 42%, transparent)`;

export const bar = style({ borderRadius: vars.radius.sm, background: fill });

export const avatar = style({
  borderRadius: vars.radius.full,
  flexShrink: 0,
  background: fillStrong,
});

export const button = style({ borderRadius: vars.radius.md, flexShrink: 0, background: fill });

export const buttonAccent = style({
  borderRadius: vars.radius.md,
  flexShrink: 0,
  background: `color-mix(in srgb, ${vars.color.accent} 62%, transparent)`,
});

export const stack = style({ display: 'flex', flexDirection: 'column', gap: 6 });

export const shimmer = style({
  display: 'flex',
  gap: vars.space.sm,
  animation: `${pulse} 1.6s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

export const shimmerBody = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  paddingTop: 4,
});

/** Поле ввода-болванка (НЕ настоящий input). */
export const field = style({
  display: 'flex',
  alignItems: 'center',
  padding: `0 ${vars.space.sm}`,
  borderRadius: vars.radius.md,
  background: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  color: vars.color.muted,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
});

// ── аннотированный блок ─────────────────────────────────────────────────────

export const block = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  padding: vars.space.sm,
  borderRadius: vars.radius.lg,
  border: `1px dashed color-mix(in srgb, ${vars.color.muted} 55%, transparent)`,
  background: `color-mix(in srgb, ${vars.color.surface} 45%, transparent)`,
  fontFamily: vars.font.family,
});

export const blockHead = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  marginBottom: 6,
});

export const blockNum = style({
  width: 16,
  height: 16,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radius.sm,
  background: vars.color.accent,
  color: vars.color.accentFg,
  fontSize: 10,
  fontWeight: vars.font.weightBold,
});

export const blockTitle = style({
  fontSize: vars.font.sizeSm,
  fontWeight: vars.font.weightBold,
  color: vars.color.fg,
});

export const blockDesc = style({
  margin: `0 0 10px`,
  fontSize: vars.font.sizeSm,
  lineHeight: 1.35,
  color: vars.color.muted,
});

export const blockBody = style({ flex: 1, minWidth: 0, minHeight: 0 });

/** 12-колоночная сетка мастер-страницы. */
export const masterGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
  gap: vars.space.sm,
  padding: vars.space.sm,
  minHeight: '100%',
});
