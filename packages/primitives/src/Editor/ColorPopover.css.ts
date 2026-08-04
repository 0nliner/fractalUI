import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const popover = style({
  position: 'fixed',
  zIndex: 10000,
  width: 236,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  padding: vars.space.sm,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  boxShadow: vars.shadow.md,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
});

export const title = style({
  fontWeight: 600,
});

export const reset = style({
  padding: '2px 8px',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: vars.color.bg,
  color: vars.color.muted,
  fontFamily: 'inherit',
  fontSize: '11px',
  cursor: 'pointer',
  selectors: {
    '&:hover': { color: vars.color.fg, borderColor: vars.color.fg },
  },
});

export const area = style({
  width: '100%',
  height: 130,
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.border}`,
  // фон (2D-градиент) проставляет react-aria инлайном по текущему цвету
});

export const slider = style({
  width: '100%',
  height: 16,
});

export const sliderTrack = style({
  width: '100%',
  height: 12,
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  // фон (радуга оттенка) — от react-aria
});

export const thumb = style({
  width: 14,
  height: 14,
  borderRadius: '50%',
  border: '2px solid #fff',
  boxSizing: 'border-box',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.4)',
  selectors: {
    '&[data-focus-visible]': { outline: `2px solid ${vars.color.accent}`, outlineOffset: 1 },
  },
});

export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const field = style({
  flex: 1,
  minWidth: 0,
});

export const input = style({
  width: '100%',
  padding: '4px 8px',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: vars.color.bg,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeSm,
  textTransform: 'uppercase',
  outline: 'none',
  selectors: {
    '&:focus': { borderColor: vars.color.accent },
  },
});

export const preview = style({
  width: 26,
  height: 26,
  flexShrink: 0,
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.border}`,
});

export const sectionLabel = style({
  color: vars.color.muted,
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
});

export const swatches = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)',
  gap: 4,
});

export const swatchItem = style({
  outline: 'none',
  borderRadius: vars.radius.sm,
});
const selectedRing = `0 0 0 2px ${vars.color.surface}, 0 0 0 3px ${vars.color.accent}`;
globalStyle(`${swatchItem}[data-selected] > *`, { boxShadow: selectedRing });
globalStyle(`${swatchItem}[data-focus-visible] > *`, { boxShadow: selectedRing });

export const swatch = style({
  display: 'block',
  width: '100%',
  aspectRatio: '1 / 1',
  minWidth: 18,
  minHeight: 18,
  padding: 0,
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.border}`,
  cursor: 'pointer',
});

export const recents = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 4,
});
