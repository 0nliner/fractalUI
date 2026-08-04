import type { ReactNode } from 'react';
import * as s from './Notification.css';

export type NotificationStatus = 'info' | 'success' | 'error';

export type NotificationProps = {
  status?: NotificationStatus;
  title?: string;
  children?: ReactNode;
  onClose?: () => void;
};

/** Карточка-уведомление со статус-полосой (перенос notificationsProvider). */
export function Notification({ status = 'info', title, children, onClose }: NotificationProps) {
  return (
    <div className={s.root} role="status">
      <span className={s.stripeTone[status]} aria-hidden />
      <div className={s.body}>
        {title ? <span className={s.title}>{title}</span> : null}
        {children ? <span className={s.text}>{children}</span> : null}
      </div>
      {onClose ? (
        <button type="button" className={s.closeBtn} onClick={onClose} aria-label="Закрыть">
          ×
        </button>
      ) : null}
    </div>
  );
}
