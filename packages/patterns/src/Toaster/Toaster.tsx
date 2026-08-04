import { Notification, type NotificationStatus } from '@fractalui/primitives';
import * as s from './Toaster.css';

export type ToastItem = {
  id: string;
  title?: string;
  message: string;
  status?: NotificationStatus;
};

export type ToasterProps = {
  items: ToastItem[];
  onDismiss: (id: string) => void;
  /** Снизу — ближе к большому пальцу; сверху — если снизу уже есть панель действий. */
  position?: 'bottom' | 'top';
};

/**
 * Отрисовка стопки уведомлений.
 *
 * Компонент НАМЕРЕННО без очереди: по доктрине L2 паттерны не владеют стором,
 * а `@fractalui/data` — пока пустая заглушка. Наполнять пакет на выборке
 * из одного потребителя значит зафиксировать неверную абстракцию.
 *
 * Очередь (TTL по типу, фасад, вызываемый вне React) живёт в приложении —
 * рабочая реализация есть в `game_heart/frontend/src/lib/toast.ts`. Когда
 * за ней придёт второй проект, поднимем сюда.
 */
export function Toaster({ items, onDismiss, position = 'bottom' }: ToasterProps) {
  if (items.length === 0) return null;

  return (
    <div
      className={position === 'top' ? `${s.root} ${s.top}` : `${s.root} ${s.bottom}`}
      // Именно polite: уведомление не должно перебивать то, что пользователь
      // читает прямо сейчас.
      role="status"
      aria-live="polite"
    >
      {items.map((item) => (
        <div key={item.id} className={s.item}>
          <Notification
            status={item.status}
            title={item.title}
            onClose={() => onDismiss(item.id)}
          >
            {item.message}
          </Notification>
        </div>
      ))}
    </div>
  );
}
