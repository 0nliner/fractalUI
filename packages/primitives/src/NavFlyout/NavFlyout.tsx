import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from 'react-aria-components';
import * as s from './NavFlyout.css';

export type NavFlyoutItem = {
  key: string;
  icon?: ReactNode;
  label: string;
  description?: string;
  badge?: number;
  onSelect: () => void;
};

export type NavFlyoutProps = {
  title: string;
  description?: string;
  items: NavFlyoutItem[];
  /** Верх кнопки-якоря в рейле (из NavRailItem.onPress). */
  anchorTop: number;
  /** Отступ слева: ширина рейла + зазор. По умолчанию 58 (48 + 10). */
  anchorLeft?: number;
  /** Ссылка «Подробнее» в шапке панели. */
  onMore?: () => void;
  onClose: () => void;
  moreLabel?: string;
};

/**
 * Якорная панель раздела рядом с `NavRail`.
 *
 * Ключевой приём экономии пространства: рейл остаётся 48px и не раскрывается —
 * пункты показываются здесь по требованию. Панель клампится по низу вьюпорта,
 * закрывается по Esc и клику вне.
 *
 * Esc слушается в capture-фазе со `stopImmediatePropagation`, чтобы глобальные
 * обработчики хоткеев приложения не перехватили событие раньше.
 */
export function NavFlyout({
  title,
  description,
  items,
  anchorTop,
  anchorLeft = 58,
  onMore,
  onClose,
  moreLabel = 'Подробнее',
}: NavFlyoutProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  // Не даём панели вылезти за нижнюю кромку экрана.
  const top = Math.max(8, Math.min(anchorTop, window.innerHeight - 340));

  return createPortal(
    <div className={s.scrim} onClick={onClose}>
      <div
        ref={panelRef}
        role="menu"
        aria-label={title}
        className={s.panel}
        style={{ top, left: anchorLeft }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={s.head}>
          <div className={s.headRow}>
            <h3 className={s.title}>{title}</h3>
            {onMore && (
              <button
                type="button"
                className={s.more}
                onClick={() => {
                  onMore();
                  onClose();
                }}
              >
                {moreLabel} →
              </button>
            )}
          </div>
          {description && <p className={s.description}>{description}</p>}
        </div>

        <div className={s.list}>
          {items.map((it) => (
            <Button
              key={it.key}
              className={s.item}
              onPress={() => {
                it.onSelect();
                onClose();
              }}
            >
              {it.icon && <span className={s.itemIcon}>{it.icon}</span>}
              <span className={s.itemBody}>
                <span className={s.itemLabel}>{it.label}</span>
                {it.description && <span className={s.itemDesc}>{it.description}</span>}
              </span>
              {it.badge != null && it.badge > 0 && (
                <span className={s.itemBadge}>{it.badge > 99 ? '99+' : it.badge}</span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
