import type { ReactNode } from 'react';
import { Button } from 'react-aria-components';
import { Tooltip } from '../Tooltip/Tooltip';
import * as s from './NavRail.css';

export type NavRailItem = {
  key: string;
  /** Иконка 16–18px. Подпись НЕ рендерится рядом — она в тултипе. */
  icon: ReactNode;
  /** Обязательна: иконка без подписи-тултипа считается недоделанной. */
  label: string;
  active?: boolean;
  badge?: number;
  /** anchorTop — координата верха кнопки, нужна для якорного NavFlyout. */
  onPress: (anchorTop: number) => void;
};

export type NavRailProps = {
  /** Верхний слот: обычно аватар профиля. */
  header?: ReactNode;
  items: NavRailItem[];
  /** Нижняя группа (прижата к низу): настройки, выход и т.п. */
  footerItems?: NavRailItem[];
  /** Полупрозрачное стекло — для случая, когда под рейлом анимированный фон. */
  glass?: boolean;
  className?: string;
};

function RailButton({ item }: { item: NavRailItem }) {
  return (
    <Tooltip content={item.label}>
      <Button
        aria-label={item.label}
        className={item.active ? s.button.active : s.button.idle}
        onPress={(e) => {
          const el = e.target as HTMLElement;
          item.onPress(el.getBoundingClientRect().top);
        }}
      >
        {item.icon}
        {item.badge != null && item.badge > 0 && (
          <span className={s.badge}>{item.badge > 99 ? '99+' : item.badge}</span>
        )}
      </Button>
    </Tooltip>
  );
}

/**
 * Вертикальный навигационный рейл фиксированной ширины 48px.
 *
 * Это базовый приём плотности: разделы раскрываются якорным `NavFlyout`,
 * а не расширением рейла, поэтому контент никогда не перекомпоновывается.
 * Данные приходят через props — компонент ничего не знает о роутере и сторе.
 */
export function NavRail({ header, items, footerItems, glass, className }: NavRailProps) {
  const cls = [s.rail, glass ? s.railGlass : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <nav className={cls}>
      {header}
      {items.map((it) => (
        <RailButton key={it.key} item={it} />
      ))}
      {footerItems && footerItems.length > 0 && (
        <div className={`${s.spacer} ${s.group}`}>
          {footerItems.map((it) => (
            <RailButton key={it.key} item={it} />
          ))}
        </div>
      )}
    </nav>
  );
}
