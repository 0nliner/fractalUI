import { style } from '@vanilla-extract/css';
import { media, vars } from '@fractalui/tokens';

export const radio = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space.sm,
  // Высота от плотности, пальцевой минимум — только на тач-устройстве.
  // См. тот же приём в Checkbox.
  minHeight: vars.size.control,
  '@media': {
    [media.coarse]: { minHeight: vars.size.tapTarget },
  },
  paddingTop: vars.space.xs,
  paddingBottom: vars.space.xs,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeMd,
  color: vars.color.fg,
  cursor: 'pointer',
  selectors: {
    '&[data-disabled]': { opacity: 0.55, cursor: 'not-allowed' },
  },
});

export const dot = style({
  flexShrink: 0,
  width: 18,
  height: 18,
  // Выравнивание по первой строке текста, а не по центру всего блока:
  // у варианта с описанием кружок иначе уезжает вниз.
  marginTop: 2,
  borderRadius: vars.radius.full,
  background: vars.color.surface,
  boxShadow: `inset 0 0 0 1px ${vars.color.border}`,
  transition: `box-shadow ${vars.motion.fast} ${vars.motion.ease}`,
  selectors: {
    [`${radio}[data-hovered] &`]: { boxShadow: `inset 0 0 0 1px ${vars.color.accent}` },
    [`${radio}[data-selected] &`]: {
      boxShadow: `inset 0 0 0 5px ${vars.color.accent}`,
    },
    [`${radio}[data-focus-visible] &`]: { boxShadow: vars.shadow.focus },
    [`${radio}[data-invalid] &`]: { boxShadow: `inset 0 0 0 1px ${vars.color.danger}` },
  },
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  lineHeight: vars.font.lineNormal,
});

export const description = style({
  fontSize: vars.font.sizeSm,
  color: vars.color.fgSubtle,
});

export const groupColumn = style({ display: 'flex', flexDirection: 'column' });

export const groupRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.lg,
});
