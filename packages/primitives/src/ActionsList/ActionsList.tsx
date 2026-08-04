import type { ReactNode } from 'react';
import { Button } from 'react-aria-components';
import * as s from './ActionsList.css';

export type ActionItem = {
  id?: string;
  icon?: ReactNode;
  label: string;
  active?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
};

export type ActionsListProps = {
  items: ActionItem[];
  orientation?: 'vertical' | 'horizontal';
};

/** Компактный список действий/навигации (перенос MinimalisticActionsList из легаси). */
export function ActionsList({ items, orientation = 'vertical' }: ActionsListProps) {
  return (
    <div className={s.root[orientation]}>
      {items.map((it, i) => (
        <Button
          key={it.id ?? `${it.label}-${i}`}
          className={s.item}
          onPress={it.onPress}
          isDisabled={it.isDisabled}
          data-active={it.active ? 'true' : undefined}
        >
          {it.icon ? <span className={s.icon}>{it.icon}</span> : null}
          <span>{it.label}</span>
        </Button>
      ))}
    </div>
  );
}
