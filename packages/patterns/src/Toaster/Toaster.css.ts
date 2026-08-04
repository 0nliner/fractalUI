import { keyframes, style } from '@vanilla-extract/css';
import { media, vars } from '@fractalui/tokens';

const slideIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const root = style({
  position: 'fixed',
  zIndex: vars.z.toast,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  // На телефоне — во всю ширину с полями; на десктопе прижимается к краю.
  left: vars.space.lg,
  right: vars.space.lg,
  pointerEvents: 'none',
  '@media': {
    [media.md]: { left: 'auto', right: vars.space.xl, width: 'min(380px, 40vw)' },
  },
});

export const bottom = style({ bottom: vars.space.lg });
export const top = style({ top: vars.space.lg });

export const item = style({
  // Сама стопка не перехватывает клики, а карточки — да: иначе тост
  // блокировал бы полосу интерфейса под собой.
  pointerEvents: 'auto',
  animation: `${slideIn} ${vars.motion.base} ${vars.motion.easeOut}`,
  '@media': {
    [media.reduceMotion]: { animation: 'none' },
  },
});
