import { style } from '@vanilla-extract/css';

export const root = style({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  filter: 'blur(40px)',
  pointerEvents: 'none',
  zIndex: 0,
});

export const blob = style({
  position: 'absolute',
  borderRadius: '9999px',
  willChange: 'transform',
});
