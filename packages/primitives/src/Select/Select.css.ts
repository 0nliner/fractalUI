import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

export const value = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const placeholder = style({ color: vars.color.fgSubtle });

export const chevron = style({
  flexShrink: 0,
  color: vars.color.muted,
  fontSize: vars.font.sizeSm,
});

export const list = style({
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

export const optionBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  paddingTop: vars.space.xs,
  paddingBottom: vars.space.xs,
});

export const optionDescription = style({
  fontSize: vars.font.sizeSm,
  color: vars.color.fgSubtle,
});
