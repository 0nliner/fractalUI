import { style } from '@vanilla-extract/css';
import { media, vars } from '@fractalui/tokens';

export const stack = style({ display: 'flex', flexDirection: 'column', minWidth: 0 });

export const inline = style({ display: 'flex', minWidth: 0 });

export const grid = style({ display: 'grid', minWidth: 0 });

export const container = style({
  width: '100%',
  marginInline: 'auto',
  boxSizing: 'border-box',
  // Mobile-first: на телефоне поля узкие, дальше расширяются.
  paddingInline: vars.space.lg,
  '@media': {
    [media.md]: { paddingInline: vars.space.xl },
    [media.lg]: { paddingInline: vars.space.xl2 },
  },
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  // Ритм секций витрины: на телефоне плотнее, на широком экране просторнее.
  paddingBlock: vars.space.xl2,
  '@media': {
    [media.md]: { paddingBlock: vars.space.xl3 },
  },
});

export const sectionHead = style({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: vars.space.md,
});

export const sectionTitle = style({
  margin: 0,
  fontFamily: vars.font.familyDisplay,
  fontSize: vars.font.sizeXl2,
  fontWeight: vars.font.weightBold,
  lineHeight: vars.font.lineTight,
  letterSpacing: vars.font.trackTight,
  '@media': {
    [media.md]: { fontSize: vars.font.sizeXl3 },
  },
});

export const sectionDescription = style({
  margin: 0,
  marginTop: vars.space.xs,
  fontSize: vars.font.sizeMd,
  color: vars.color.muted,
});
