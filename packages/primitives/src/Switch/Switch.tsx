import type { ReactNode } from 'react';
import { Switch as AriaSwitch, type SwitchProps as AriaSwitchProps } from 'react-aria-components';
import * as s from './Switch.css';

export type SwitchProps = Omit<AriaSwitchProps, 'children' | 'className'> & {
  children?: ReactNode;
};

/** Переключатель на React Aria. Состояние selected стилизуется через data-selected. */
export function Switch({ children, ...props }: SwitchProps) {
  return (
    <AriaSwitch {...props} className={s.root}>
      <span className={s.track}>
        <span className={s.thumb} />
      </span>
      {children}
    </AriaSwitch>
  );
}
