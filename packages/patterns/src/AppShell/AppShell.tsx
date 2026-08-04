import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { NavRail, NavFlyout, type NavRailItem, type NavFlyoutItem } from '@fractalui/primitives';
import * as s from './AppShell.css';

export type ShellSection = {
  key: string;
  label: string;
  description?: string;
  icon: ReactNode;
  badge?: number;
  /** Активен ли раздел (решает приложение — паттерн не знает о роутере). */
  active?: boolean;
  /** Пункты раздела. Пусто → клик по иконке просто вызывает onSelect. */
  items?: NavFlyoutItem[];
  /** Действие «Подробнее» во флайауте и/или клик по иконке без пунктов. */
  onSelect?: () => void;
};

export type AppShellProps = {
  /** Слот бренда/лого слева в шапке. */
  brand?: ReactNode;
  /** Центральный слот шапки — обычно триггер командной палитры (⌘K). */
  headerCenter?: ReactNode;
  /** Правый слот шапки — компактные иконки 13–14px. */
  headerRight?: ReactNode;
  /** Верх рейла — обычно аватар профиля. */
  railHeader?: ReactNode;
  sections: ShellSection[];
  /** Нижняя группа рейла: настройки, выход. */
  railFooter?: NavRailItem[];
  /** Фон под всем (например, <LavaLamp/>). Рейл тогда включает стекло. */
  backdrop?: ReactNode;
  /**
   * Постоянная панель справа от рабочей области: чат ассистента, инспектор.
   * Стоит рядом с `main`, а не поверх — её ширину пользователь тянет сам, и
   * перекрывать содержимое она не должна.
   */
  rightDock?: ReactNode;
  /**
   * Атрибуты рабочей области. Нужны приложениям, которые вешают на неё
   * якоря — например, слой правок ищет корень по `data-anno-root`.
   */
  mainProps?: HTMLAttributes<HTMLElement> & Record<`data-${string}`, string | boolean>;
  children: ReactNode;
};

/**
 * Каркас плотного приложения: тонкая шапка (44px) + плавающий рейл 48px,
 * разделы которого раскрываются якорным флайаутом.
 *
 * Главное свойство: **рабочая область никогда не перекомпоновывается** при
 * смене раздела — рейл не меняет ширину, флайаут рисуется поверх.
 *
 * Паттерн не знает ни о роутере, ни о сторе: состояние активности и обработчики
 * приходят через props (правило слоя L2).
 */
export function AppShell({
  brand,
  headerCenter,
  headerRight,
  railHeader,
  sections,
  railFooter,
  backdrop,
  rightDock,
  mainProps,
  children,
}: AppShellProps) {
  const [flyout, setFlyout] = useState<{ key: string; top: number } | null>(null);
  const open = sections.find((x) => x.key === flyout?.key);

  const railItems: NavRailItem[] = sections.map((sec) => ({
    key: sec.key,
    icon: sec.icon,
    label: sec.label,
    active: sec.active || flyout?.key === sec.key,
    badge: sec.badge,
    onPress: (top) => {
      if (sec.items && sec.items.length > 0) setFlyout({ key: sec.key, top });
      else sec.onSelect?.();
    },
  }));

  return (
    <div className={s.root}>
      {backdrop}

      <header className={s.header}>
        <div className={s.headerBrand}>{brand}</div>
        {headerCenter && <div className={s.headerCenter}>{headerCenter}</div>}
        <div className={s.headerRight}>{headerRight}</div>
      </header>

      <div className={s.body}>
        <div className={s.railSlot}>
          <NavRail
            header={railHeader}
            items={railItems}
            footerItems={railFooter}
            glass={Boolean(backdrop)}
          />
        </div>

        {open && flyout && open.items && (
          <NavFlyout
            title={open.label}
            description={open.description}
            items={open.items}
            anchorTop={flyout.top}
            onMore={open.onSelect}
            onClose={() => setFlyout(null)}
          />
        )}

        <main
          {...mainProps}
          className={mainProps?.className ? `${s.main} ${mainProps.className}` : s.main}
        >
          {children}
        </main>

        {rightDock}
      </div>
    </div>
  );
}
