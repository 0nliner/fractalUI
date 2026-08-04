/**
 * Пресеты цветов для пипетки блока.
 *
 * Палитра — Open Color (https://yeun.github.io/open-color/), лицензия MIT
 * © 2016 heeyeun. Значения вшиты константами (не npm-пакет), чтобы фича была
 * самодостаточной и юридически чистой при переиспользовании.
 */

/** Насыщенный ряд (Open Color shade 6) по всем оттенкам + чёрный/белый/серые. */
export const PRESET_COLORS: string[] = [
  '#000000', '#495057', '#adb5bd', '#ffffff',
  '#fa5252', // red 6
  '#fd7e14', // orange 6
  '#fab005', // yellow 6
  '#82c91e', // lime 6
  '#40c057', // green 6
  '#12b886', // teal 6
  '#15aabf', // cyan 6
  '#228be6', // blue 6
  '#4c6ef5', // indigo 6
  '#7950f2', // violet 6
  '#be4bdb', // grape 6
  '#e64980', // pink 6
]

/** Светлый ряд (Open Color shade 2) — удобен для фонов блоков. */
export const PRESET_COLORS_LIGHT: string[] = [
  '#f1f3f5', '#dee2e6', '#ced4da', '#868e96',
  '#ffc9c9', // red 2
  '#ffd8a8', // orange 2
  '#ffec99', // yellow 2
  '#d8f5a2', // lime 2
  '#b2f2bb', // green 2
  '#96f2d7', // teal 2
  '#99e9f2', // cyan 2
  '#a5d8ff', // blue 2
  '#bac8ff', // indigo 2
  '#d0bfff', // violet 2
  '#eebefa', // grape 2
  '#fcc2d7', // pink 2
]

export const ALL_PRESETS: string[] = [...PRESET_COLORS, ...PRESET_COLORS_LIGHT]
