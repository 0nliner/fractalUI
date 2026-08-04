import type { ReactNode } from 'react';
import { Card } from '@fractalui/primitives';
import * as s from './Feed.css';

export type FeedField<T> = {
  key: keyof T & string;
  label?: string;
  render?: (row: T) => ReactNode;
};

export type FeedProps<T> = {
  items: T[];
  fields: FeedField<T>[];
  getItemId?: (row: T) => string;
  renderActions?: (row: T) => ReactNode;
  emptyMessage?: string;
};

/**
 * Карточная сетка из конфига (перенос FeedFactory). Третий тип визуализации
 * рядом с AutoTable. Данные через props.
 */
export function Feed<T>({ items, fields, getItemId, renderActions, emptyMessage = 'Нет данных' }: FeedProps<T>) {
  if (items.length === 0) {
    return <div className={s.empty}>{emptyMessage}</div>;
  }
  return (
    <div className={s.grid}>
      {items.map((row, i) => (
        <Card key={getItemId ? getItemId(row) : i}>
          {fields.map((f) => {
            const raw = (row as Record<string, unknown>)[f.key];
            return (
              <div key={f.key} className={s.field}>
                {f.label ? <span className={s.label}>{f.label}</span> : null}
                <span className={s.value}>{f.render ? f.render(row) : raw == null ? '' : String(raw)}</span>
              </div>
            );
          })}
          {renderActions ? <div className={s.actions}>{renderActions(row)}</div> : null}
        </Card>
      ))}
    </div>
  );
}
