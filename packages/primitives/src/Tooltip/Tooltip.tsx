import type { ReactElement, ReactNode } from 'react';
import { TooltipTrigger, Tooltip as AriaTooltip } from 'react-aria-components';
import * as s from './Tooltip.css';

export type TooltipProps = {
  content: ReactNode;
  /** Фокусируемый триггер (например, <Button> из react-aria-components). */
  children: ReactElement;
  delay?: number;
};

/** Подсказка на React Aria. children должен быть фокусируемым (RAC Button/Link). */
export function Tooltip({ content, children, delay = 400 }: TooltipProps) {
  return (
    <TooltipTrigger delay={delay}>
      {children}
      <AriaTooltip className={s.tooltip}>{content}</AriaTooltip>
    </TooltipTrigger>
  );
}
