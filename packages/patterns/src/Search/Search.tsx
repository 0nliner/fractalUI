import { TextField, Button } from '@fractalui/primitives';
import * as s from './Search.css';

export type SearchProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onFilter?: () => void;
  placeholder?: string;
};

/** Строка поиска + опциональная кнопка фильтра (перенос search). */
export function Search({ value, onChange, onSubmit, onFilter, placeholder = 'Поиск…' }: SearchProps) {
  return (
    <form
      className={s.root}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value ?? '');
      }}
    >
      <div className={s.field}>
        <TextField aria-label="Поиск" placeholder={placeholder} value={value} onChange={onChange} />
      </div>
      {onFilter ? (
        <Button variant="secondary" size="sm" onPress={onFilter}>
          Фильтр
        </Button>
      ) : null}
    </form>
  );
}
