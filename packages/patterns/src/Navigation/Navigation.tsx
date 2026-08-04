import type { ReactNode } from 'react';
import { ActionsList, type ActionItem } from '@fractalui/primitives';
import * as s from './Navigation.css';

export type NavigationProps = {
  items: ActionItem[];
  logo?: ReactNode;
  title?: string;
  footer?: ReactNode;
};

/** Боковая навигация (перенос DefaultNavigation): бренд + ActionsList. */
export function Navigation({ items, logo, title, footer }: NavigationProps) {
  return (
    <aside className={s.root}>
      {logo || title ? (
        <div className={s.brand}>
          {logo}
          {title ? <span className={s.title}>{title}</span> : null}
        </div>
      ) : null}
      <ActionsList items={items} />
      {footer ? <div className={s.footer}>{footer}</div> : null}
    </aside>
  );
}
