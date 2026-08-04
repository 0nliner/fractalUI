import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  display: 'flex',
  minWidth: 0,
  minHeight: 0,
  position: 'relative',
});

export const body = style({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

/**
 * Шторка. Видимая полоса тонкая, а хватать нужно легко, поэтому зона захвата
 * шире самой полосы за счёт отрицательных отступов — иначе в неё приходится
 * целиться, и ресайз ощущается капризным.
 */
export const handle = style({
  position: 'relative',
  flexShrink: 0,
  width: 1,
  alignSelf: 'stretch',
  border: 'none',
  padding: 0,
  background: vars.color.border,
  cursor: 'col-resize',
  touchAction: 'none',
  transition: 'background .12s ease',
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: -3,
      right: -3,
    },
    '&:hover, &[data-dragging="true"]': { background: vars.color.accent },
    '&:focus-visible': {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: 1,
    },
  },
});
