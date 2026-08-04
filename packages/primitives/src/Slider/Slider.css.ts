import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const header = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: vars.space.sm,
});

export const output = style({
  fontSize: vars.font.sizeSm,
  color: vars.color.fg,
  fontVariantNumeric: 'tabular-nums',
});

export const track = style({
  position: 'relative',
  // Дорожка тонкая, но зона захвата — во всю высоту пальца.
  height: vars.size.tapTarget,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  selectors: {
    '&[data-disabled]': { opacity: 0.55, cursor: 'not-allowed' },
  },
});

export const rail = style({
  position: 'absolute',
  left: 0,
  right: 0,
  height: 4,
  borderRadius: vars.radius.full,
  background: vars.color.surfaceSunken,
});

export const fill = style({
  position: 'absolute',
  height: 4,
  borderRadius: vars.radius.full,
  background: vars.color.accent,
});

export const thumb = style({
  width: 18,
  height: 18,
  borderRadius: vars.radius.full,
  background: vars.color.accent,
  boxShadow: vars.shadow.sm,
  // RAC позиционирует ручку сам; своё top/left задавать нельзя.
  transition: `box-shadow ${vars.motion.fast} ${vars.motion.ease}`,
  selectors: {
    '&[data-hovered]': { boxShadow: vars.shadow.md },
    '&[data-dragging]': { background: vars.color.accentActive },
    '&[data-focus-visible]': { outline: 'none', boxShadow: vars.shadow.focus },
  },
});
