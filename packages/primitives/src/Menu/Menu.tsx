import {
  MenuTrigger,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  Popover,
  Separator,
  type MenuProps as AriaMenuProps,
  type MenuItemProps as AriaMenuItemProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import * as f from '../field/field.css';
import * as s from './Menu.css';

export type MenuItemProps = Omit<AriaMenuItemProps, 'className' | 'children'> & {
  children?: ReactNode;
  /** Опасное действие — удаление. Красится в danger. */
  isDestructive?: boolean;
};

export function MenuItem({ children, isDestructive, ...props }: MenuItemProps) {
  return (
    <AriaMenuItem
      {...props}
      className={isDestructive ? `${f.option} ${s.destructive}` : f.option}
    >
      {children}
    </AriaMenuItem>
  );
}

export type MenuProps<T extends object> = Omit<AriaMenuProps<T>, 'className'> & {
  /** Ширина панели. По умолчанию — по ширине триггера. */
  minWidth?: number;
};

/**
 * Выпадающее меню действий.
 *
 * Оборачивается в `MenuTrigger` вместе с кнопкой:
 * ```tsx
 * <MenuTrigger>
 *   <Button>Действия</Button>
 *   <Menu onAction={…}><MenuItem id="edit">Изменить</MenuItem></Menu>
 * </MenuTrigger>
 * ```
 * Нужно меню аккаунта в шапке, сортировке каталога и кебабу на карточке товара.
 */
export function Menu<T extends object>({ minWidth, ...props }: MenuProps<T>) {
  return (
    <Popover className={f.popover} style={minWidth ? { minWidth } : undefined}>
      <AriaMenu {...props} className={s.menu} />
    </Popover>
  );
}

export const MenuSeparator = () => <Separator className={s.separator} />;

export { MenuTrigger };
