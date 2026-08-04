/**
 * Значения токенов fractalUI (plain TS, без vanilla-extract).
 *
 * Палитра — айдентика проекта: тёмный UI, тил-зелёный акцент и фирменный
 * градиент teal → green (#357666 → #7caf54). БЕЗ оранжевого.
 * Плотность компактная (база 13px, радиус 10), обводок по умолчанию нет —
 * поверхности держатся на фоне + тенях.
 *
 * Плотность здесь НАМЕРЕННО остаётся админской. Продукту с другой плотностью
 * (витрине, лендингу) не нужно форкать компоненты: он переопределяет
 * `font.sizeMd`, `size.control` и `space.md` своей темой через
 * `defineThemeValues`. Менять дефолты кита значило бы молча переверстать все
 * приложения, которые его уже потребляют.
 */

export interface ColorTokens {
  bg: string;
  surface: string;
  fg: string;
  muted: string;
  /** Третий уровень текста: цены, единицы, метки. */
  fgSubtle: string;
  accent: string;
  accentFg: string;
  border: string;
  danger: string;
  overlay: string;
  success: string;
  successFg: string;
  warning: string;
  warningFg: string;
  info: string;
  infoFg: string;
  accentHover: string;
  accentActive: string;
  surfaceHover: string;
  surfaceSunken: string;
}

export interface GradientTokens {
  brand: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  focus: string;
}

export interface SpaceTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xl2: string;
  xl3: string;
  xl4: string;
  xl5: string;
}

export interface RadiusTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface FontTokens {
  family: string;
  familyDisplay: string;
  sizeSm: string;
  sizeMd: string;
  sizeLg: string;
  sizeXl: string;
  sizeXl2: string;
  sizeXl3: string;
  sizeXl4: string;
  weightRegular: string;
  weightMedium: string;
  weightBold: string;
  lineTight: string;
  lineNormal: string;
  lineRelaxed: string;
  trackTight: string;
  trackNormal: string;
  trackWide: string;
}

export interface SizeTokens {
  control: string;
  controlSm: string;
  controlLg: string;
  tapTarget: string;
  containerMd: string;
  containerLg: string;
  containerXl: string;
}

export interface ZTokens {
  base: string;
  dropdown: string;
  sticky: string;
  overlay: string;
  modal: string;
  popover: string;
  toast: string;
  tooltip: string;
}

export interface MotionTokens {
  fast: string;
  base: string;
  slow: string;
  ease: string;
  easeOut: string;
}

export interface ThemeValues {
  color: ColorTokens;
  gradient: GradientTokens;
  shadow: ShadowTokens;
  space: SpaceTokens;
  radius: RadiusTokens;
  font: FontTokens;
  size: SizeTokens;
  z: ZTokens;
  motion: MotionTokens;
}

/** Фирменный градиент — тил → зелёный, одинаков в обеих темах. */
const BRAND_GRADIENT = 'linear-gradient(135deg, #357666 0%, #7caf54 100%)';

/** Компактные шкалы — одинаковы у светлой и тёмной темы. */
const space: SpaceTokens = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xl2: '32px',
  xl3: '48px',
  xl4: '64px',
  xl5: '96px',
};

const radius: RadiusTokens = {
  sm: '6px',
  md: '8px',
  lg: '10px',
  xl: '16px',
  full: '9999px',
};

const font: FontTokens = {
  family: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  // По умолчанию совпадает с основной: заголовочная гарнитура — дело продукта.
  familyDisplay: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  sizeSm: '11px',
  sizeMd: '13px',
  sizeLg: '16px',
  sizeXl: '20px',
  sizeXl2: '24px',
  sizeXl3: '32px',
  sizeXl4: '40px',
  weightRegular: '400',
  weightMedium: '500',
  weightBold: '600',
  lineTight: '1.2',
  lineNormal: '1.5',
  lineRelaxed: '1.7',
  trackTight: '-0.02em',
  trackNormal: '0',
  trackWide: '0.04em',
};

const size: SizeTokens = {
  control: '28px',
  controlSm: '22px',
  controlLg: '36px',
  // От плотности не зависит: это физиология пальца, а не стиль.
  tapTarget: '44px',
  containerMd: '768px',
  containerLg: '1120px',
  containerXl: '1320px',
};

const z: ZTokens = {
  base: '0',
  dropdown: '100',
  sticky: '200',
  overlay: '300',
  modal: '400',
  popover: '500',
  toast: '600',
  tooltip: '700',
};

const motion: MotionTokens = {
  fast: '120ms',
  base: '200ms',
  slow: '320ms',
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

/** Тёмная тема — основная айдентика fractalUI. */
export const darkValues: ThemeValues = {
  color: {
    bg: '#161616',
    surface: '#252525',
    fg: '#f4f5f5',
    muted: '#9aa0a6',
    fgSubtle: '#6f757c',
    accent: '#3e8f78', // тил, чуть ярче базового #357666 для контраста на тёмном
    accentFg: '#0b1512',
    border: '#333333',
    danger: '#ff6b6b',
    overlay: 'rgba(0, 0, 0, 0.5)',
    success: '#4caf7d',
    successFg: '#08150f',
    warning: '#e0a341',
    warningFg: '#1a1206',
    info: '#5b9dd9',
    infoFg: '#07131f',
    // На тёмной теме состояния светлее базового: подмешан `fg`, как это делает
    // `defineThemeValues` для брендовых тем. Дефолт кита и переопределение
    // продукта ведут себя одинаково.
    accentHover: '#54a189',
    accentActive: '#6ab39c',
    surfaceHover: '#2f2f2f',
    surfaceSunken: '#1d1d1d',
  },
  gradient: { brand: BRAND_GRADIENT },
  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.35)',
    md: '0 4px 10px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 24px rgba(0, 0, 0, 0.4)',
    xl: '0 24px 60px rgba(0, 0, 0, 0.5)',
    focus: '0 0 0 3px rgba(62, 143, 120, 0.45)',
  },
  space,
  radius,
  font,
  size,
  z,
  motion,
};

/** Светлая тема. */
export const lightValues: ThemeValues = {
  color: {
    bg: '#ffffff',
    surface: '#f5f6f5',
    fg: '#161616',
    muted: '#5f6671',
    fgSubtle: '#868d97',
    accent: '#357666', // базовый тил из легаси (rgb 53,118,102)
    accentFg: '#ffffff',
    border: '#e4e6e8',
    danger: '#d83a3a',
    overlay: 'rgba(0, 0, 0, 0.4)',
    success: '#2e7d52',
    successFg: '#ffffff',
    warning: '#b3781a',
    warningFg: '#ffffff',
    info: '#2f6fa8',
    infoFg: '#ffffff',
    // На светлой теме `fg` тёмный, поэтому та же формула затемняет.
    accentHover: '#2c6456',
    accentActive: '#245247',
    surfaceHover: '#eaebeb',
    surfaceSunken: '#e0e2e1',
  },
  gradient: { brand: BRAND_GRADIENT },
  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 10px rgba(0, 0, 0, 0.15)',
    lg: '0 10px 24px rgba(0, 0, 0, 0.12)',
    xl: '0 24px 60px rgba(0, 0, 0, 0.16)',
    focus: '0 0 0 3px rgba(53, 118, 102, 0.30)',
  },
  space,
  radius,
  font,
  size,
  z,
  motion,
};
