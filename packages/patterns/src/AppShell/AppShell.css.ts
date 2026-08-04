import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  fontFamily: vars.font.family,
  color: vars.color.fg,
});

/** Тонкая шапка: 44px. Крупные кнопки с текстом сюда не ставим. */
export const header = style({
  height: 44,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `0 ${vars.space.sm}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const headerBrand = style({ display: 'flex', alignItems: 'center', flexShrink: 0 });

export const headerCenter = style({
  flex: '0 1 384px',
  minWidth: 0,
  '@media': { 'screen and (max-width: 768px)': { display: 'none' } },
});

export const headerRight = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 6,
});

export const body = style({ flex: 1, minHeight: 0, display: 'flex' });

/** Рейл плавает: отступы со всех сторон, а не «приклеен» к кромке. */
export const railSlot = style({
  margin: `${vars.space.xs} 4px ${vars.space.xs} ${vars.space.xs}`,
  display: 'flex',
});

export const main = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  margin: `${vars.space.xs} ${vars.space.xs} ${vars.space.xs} 0`,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.bg,
});
