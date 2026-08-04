/**
 * Значения токенов fractalUI (plain TS, без vanilla-extract).
 *
 * Палитра — айдентика проекта: тёмный UI, тил-зелёный акцент и фирменный
 * градиент teal → green (#357666 → #7caf54). БЕЗ оранжевого.
 * Плотность компактная (база 13px, радиус 10), обводок по умолчанию нет —
 * поверхности держатся на фоне + тенях.
 */

export interface ColorTokens {
  bg: string;
  surface: string;
  fg: string;
  muted: string;
  accent: string;
  accentFg: string;
  border: string;
  danger: string;
  overlay: string;
}

export interface GradientTokens {
  brand: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
}

export interface SpaceTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface RadiusTokens {
  sm: string;
  md: string;
  lg: string;
  full: string;
}

export interface FontTokens {
  family: string;
  sizeSm: string;
  sizeMd: string;
  sizeLg: string;
  weightRegular: string;
  weightBold: string;
}

export interface ThemeValues {
  color: ColorTokens;
  gradient: GradientTokens;
  shadow: ShadowTokens;
  space: SpaceTokens;
  radius: RadiusTokens;
  font: FontTokens;
}

/** Фирменный градиент — тил → зелёный, одинаков в обеих темах. */
const BRAND_GRADIENT = 'linear-gradient(135deg, #357666 0%, #7caf54 100%)';

/** Компактные шкалы — одинаковы у светлой и тёмной темы. */
const space: SpaceTokens = { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px' };
const radius: RadiusTokens = { sm: '6px', md: '8px', lg: '10px', full: '9999px' };
const font: FontTokens = {
  family: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  sizeSm: '11px',
  sizeMd: '13px',
  sizeLg: '16px',
  weightRegular: '400',
  weightBold: '600',
};

/** Тёмная тема — основная айдентика fractalUI. */
export const darkValues: ThemeValues = {
  color: {
    bg: '#161616',
    surface: '#252525',
    fg: '#f4f5f5',
    muted: '#9aa0a6',
    accent: '#3e8f78', // тил, чуть ярче базового #357666 для контраста на тёмном
    accentFg: '#0b1512',
    border: '#333333',
    danger: '#ff6b6b',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  gradient: { brand: BRAND_GRADIENT },
  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.35)',
    md: '0 4px 10px rgba(0, 0, 0, 0.3)',
  },
  space,
  radius,
  font,
};

/** Светлая тема. */
export const lightValues: ThemeValues = {
  color: {
    bg: '#ffffff',
    surface: '#f5f6f5',
    fg: '#161616',
    muted: '#5f6671',
    accent: '#357666', // базовый тил из легаси (rgb 53,118,102)
    accentFg: '#ffffff',
    border: '#e4e6e8',
    danger: '#d83a3a',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  gradient: { brand: BRAND_GRADIENT },
  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 10px rgba(0, 0, 0, 0.15)',
  },
  space,
  radius,
  font,
};
