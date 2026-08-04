import type { ReactNode } from 'react';
import * as s from './ViewSwitcher.css';

export type ViewSwitcherItem = {
  id: string;
  label: string;
  /** Иконка приходит снаружи — кит не тянет иконочную библиотеку. */
  icon?: ReactNode;
  hotkey?: string;
  isDisabled?: boolean;
};

export type ViewSwitcherProps = {
  items: ViewSwitcherItem[];
  value: string;
  onChange: (id: string) => void;
  /** Правая приписка: подсказка, счётчик, статус. */
  hint?: ReactNode;
  className?: string;
};

/**
 * Переключатель режимов рабочей области — плавающая пилюля внизу канваса.
 *
 * Управляемый: активный режим обычно живёт в URL, чтобы на него можно было
 * дать ссылку и чтобы он пережил перезагрузку. Панели внутри компонент не
 * рендерит — он только переключает, содержимое рисует владелец.
 */
export function ViewSwitcher({ items, value, onChange, hint, className }: ViewSwitcherProps) {
  return (
    <div
      className={className ? `${s.root} ${className}` : s.root}
      role="tablist"
      aria-label="Режим просмотра"
    >
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          role="tab"
          className={s.chip}
          data-active={it.id === value ? 'true' : undefined}
          aria-selected={it.id === value}
          disabled={it.isDisabled}
          title={it.hotkey ? `${it.label} · ${it.hotkey}` : it.label}
          onClick={() => onChange(it.id)}
        >
          {it.icon}
          {it.label}
        </button>
      ))}
      {hint ? <span className={s.hint}>{hint}</span> : null}
    </div>
  );
}
