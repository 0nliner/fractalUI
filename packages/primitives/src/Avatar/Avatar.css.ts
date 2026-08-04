import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radius.full,
  color: '#fff',
  fontFamily: vars.font.family,
  fontWeight: vars.font.weightBold,
  userSelect: 'none',
  overflow: 'hidden',
  flexShrink: 0,
});
