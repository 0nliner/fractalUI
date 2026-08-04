import type { ReactNode } from 'react';
import * as s from './Chip.css';

export type ChipProps = {
  children: ReactNode;
  /** Выбранное состояние — для фильтров-переключателей. */
  isSelected?: boolean;
  /** Нажатие по самому чипу: применить фильтр, перейти к тегу. */
  onPress?: () => void;
  /** Крестик справа. Появляется только если передан обработчик. */
  onRemove?: () => void;
  isDisabled?: boolean;
};

/**
 * Компактная метка: тег, применённый фильтр, выбранная категория.
 *
 * Три роли в одном компоненте намеренно: вид у них одинаковый, различаются
 * только наличием обработчиков. Отдельные `Tag`, `FilterChip` и
 * `RemovableChip` разошлись бы по стилям уже на второй правке.
 *
 * Крестик — отдельная кнопка рядом, а не внутри основной: вложенные кнопки
 * невалидны в HTML, и клик по крестику сначала применял бы фильтр.
 */
export function Chip({ children, isSelected, onPress, onRemove, isDisabled }: ChipProps) {
  const interactive = Boolean(onPress) && !isDisabled;

  return (
    <span
      className={[s.root, isSelected ? s.selected : '', isDisabled ? s.disabled : '']
        .filter(Boolean)
        .join(' ')}
    >
      {interactive ? (
        <button
          type="button"
          className={s.pressArea}
          onClick={onPress}
          disabled={isDisabled}
          aria-pressed={isSelected}
        >
          {children}
        </button>
      ) : (
        <span className={s.text}>{children}</span>
      )}

      {onRemove ? (
        <button
          type="button"
          className={s.remove}
          disabled={isDisabled}
          onClick={onRemove}
          aria-label="Убрать"
        >
          ✕
        </button>
      ) : null}
    </span>
  );
}
