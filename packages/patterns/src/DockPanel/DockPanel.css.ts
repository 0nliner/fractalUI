import { style } from '@vanilla-extract/css';
import { vars } from '@fractalui/tokens';

/**
 * Поверхность дока. Левый край рисует ручка `ResizablePanel` (1px border).
 * `maxWidth: 92vw` — страховка от схлопывания `main` на узком окне (в отличие
 * от `Drawer`, `ResizablePanel` сам ширину вьюпортом не капит).
 */
export const dock = style({
  background: vars.color.surface,
  maxWidth: '92vw',
});
