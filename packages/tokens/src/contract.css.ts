import { createThemeContract } from '@vanilla-extract/css';

import type { ThemeValues } from './themes/values';

/**
 * Форма контракта, выведенная из `ThemeValues`: те же группы, те же ключи,
 * значения заменены на `null`.
 *
 * Ради этого типа контракт и импортирует значения. Он — единственная защита от
 * расхождения: добавили ключ в `ThemeValues`, но забыли здесь (или наоборот) —
 * `tsc` падает. Раньше рассинхрон ловился только на сборке приложения, где
 * `assignVars` бросает «Tokens don't match contract» без указания, какой ключ
 * лишний. Проверка типом бьёт раньше и точнее, а `typecheck` уже гоняется
 * и в turbo, и у каждого из трёх потребителей кита.
 */
type ContractShape = {
  [Group in keyof ThemeValues]: { [Token in keyof ThemeValues[Group]]: null };
};

/**
 * Контракт дизайн-токенов fractalUI (L0) — ТОЛЬКО форма (имена CSS-переменных).
 *
 * Значения подставляются темами (`lightTheme`/`darkTheme`) или брендом продукта
 * через `createTheme(vars, values)` в `*.css.ts`. Компоненты L1+ ссылаются ТОЛЬКО
 * на `vars.*`, без хардкода цветов/размеров.
 *
 * Добавление ключа сюда — ЛОМАЮЩЕЕ изменение: `assignVars` бросает
 * «Tokens don't match contract» на сборке у каждого, кто собирает свою тему.
 * Поэтому новый ключ обязан получить значение в обоих `lightValues` и
 * `darkValues`, а состояния наведения — ещё и вывод из соседних токенов
 * в `defineThemeValues`, чтобы сторонние темы не пришлось дописывать руками.
 *
 * Брейкпоинтов здесь нет и быть не может: `@media (min-width: var(--x))` —
 * невалидный CSS, медиа-условия не читают кастомные свойства. Они лежат
 * обычным TS в `breakpoints.ts`.
 */
const contract: ContractShape = {
  color: {
    bg: null,
    surface: null,
    fg: null,
    muted: null,
    accent: null,
    accentFg: null,
    border: null,
    danger: null,
    overlay: null,

    // Третий уровень текста. `fg` — основной, `muted` — второстепенный,
    // `fgSubtle` — цены, единицы, метки: витрине двух уровней не хватает.
    fgSubtle: null,

    // Семантика статусов. Раньше был только `danger`, поэтому «добавлено
    // в корзину» и «товар заканчивается» рисовать было нечем.
    success: null,
    successFg: null,
    warning: null,
    warningFg: null,
    info: null,
    infoFg: null,

    // Состояния взаимодействия. До них компоненты пользовались
    // `filter: brightness(1.08)` — на насыщенном акценте это грязнит оттенок,
    // а на светлой теме почти не видно.
    accentHover: null,
    accentActive: null,
    surfaceHover: null,
    surfaceSunken: null,
  },
  // Фирменный градиент fractalUI (teal → green) — узнаваемая айдентика.
  gradient: {
    brand: null,
  },
  // По умолчанию обводок нет — поверхности держатся на фоне + тенях.
  shadow: {
    sm: null,
    md: null,
    lg: null,
    xl: null,
    // Кольцо фокуса тенью, а не outline: не ломает скругления и темизируется.
    focus: null,
  },
  space: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    // Ритм секций витрины: прежняя шкала обрывалась на 24px.
    xl2: null,
    xl3: null,
    xl4: null,
    xl5: null,
  },
  radius: { sm: null, md: null, lg: null, xl: null, full: null },
  font: {
    family: null,
    familyDisplay: null,
    sizeSm: null,
    sizeMd: null,
    sizeLg: null,
    // Шкала заголовков. Выше 16px не было ничего — заголовку витрины
    // не из чего было собраться.
    sizeXl: null,
    sizeXl2: null,
    sizeXl3: null,
    sizeXl4: null,
    weightRegular: null,
    weightMedium: null,
    weightBold: null,
    lineTight: null,
    lineNormal: null,
    lineRelaxed: null,
    trackTight: null,
    trackNormal: null,
    trackWide: null,
  },
  /**
   * Размеры. Главное здесь — `control`: кит рисовался под плотную админку,
   * и высота контролов сидела в компонентах числом. Через токен продукт задаёт
   * свою плотность темой, не форкая компоненты. `tapTarget` — минимум 44px
   * для пальца, ниже него на мобиле промахиваются.
   */
  size: {
    control: null,
    controlSm: null,
    controlLg: null,
    tapTarget: null,
    containerMd: null,
    containerLg: null,
    containerXl: null,
  },
  /** Порядок наложения. Раньше z-index писался числом в каждом компоненте. */
  z: {
    base: null,
    dropdown: null,
    sticky: null,
    overlay: null,
    modal: null,
    popover: null,
    toast: null,
    tooltip: null,
  },
  motion: {
    fast: null,
    base: null,
    slow: null,
    ease: null,
    easeOut: null,
  },
};

export const vars = createThemeContract(contract);

export type Vars = typeof vars;
