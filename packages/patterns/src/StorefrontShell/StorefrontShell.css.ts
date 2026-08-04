import { style } from '@vanilla-extract/css';
import { media, vars } from '@fractalui/tokens';

export const root = style({
  // Скролл документа, а не внутренней области: в отличие от AppShell витрина
  // должна вести себя как обычная страница — с адресной строкой, которая
  // прячется на телефоне, и рабочим «наверх».
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: vars.color.bg,
  color: vars.color.fg,
  fontFamily: vars.font.family,
  fontSize: vars.font.sizeMd,
});

export const header = style({
  position: 'sticky',
  top: 0,
  zIndex: vars.z.sticky,
  background: vars.color.bg,
  borderBottom: `1px solid ${vars.color.border}`,
  paddingBlock: vars.space.md,
});

export const headerRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  minHeight: vars.size.tapTarget,
});

export const burger = style({
  flexShrink: 0,
  fontSize: vars.font.sizeLg,
  '@media': {
    [media.md]: { display: 'none' },
  },
});

export const brand = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
});

export const searchDesktop = style({
  display: 'none',
  flex: 1,
  minWidth: 0,
  '@media': {
    [media.md]: { display: 'block' },
  },
});

export const searchMobile = style({
  marginTop: vars.space.md,
  '@media': {
    [media.md]: { display: 'none' },
  },
});

export const navDesktop = style({
  display: 'none',
  alignItems: 'center',
  gap: vars.space.lg,
  '@media': {
    [media.lg]: { display: 'flex' },
  },
});

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  // Прижимает блок действий вправо, когда поиска в шапке нет.
  marginLeft: 'auto',
});

export const subheader = style({
  paddingTop: vars.space.md,
  fontSize: vars.font.sizeSm,
  color: vars.color.muted,
});

export const main = style({
  flex: 1,
  minWidth: 0,
});

export const footer = style({
  marginTop: vars.space.xl4,
  paddingBlock: vars.space.xl2,
  borderTop: `1px solid ${vars.color.border}`,
  color: vars.color.muted,
  fontSize: vars.font.sizeSm,
});
