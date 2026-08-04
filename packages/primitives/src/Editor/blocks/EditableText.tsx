import { memo, useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import * as s from '../BlockEditor.css';

/**
 * Правки уезжают наверх с задержкой: при быстрой печати каждый символ иначе
 * перерисовывает весь список блоков и роняет каретку.
 */
const DEBOUNCE_MS = 250;

export interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
  isEditing: boolean;
  placeholder: string;
  /** Многострочный ввод (textarea с автовысотой) вместо однострочного. */
  multiline?: boolean;
  readOnly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Редактируемый текст блока: в режиме правки — поле, иначе — обычный текст.
 *
 * Локальное значение живёт здесь, а наружу отдаётся с задержкой. Перед любой
 * клавишей, которая меняет структуру документа (Enter, Tab, Esc, удаление
 * пустого блока), значение сбрасывается наверх немедленно — иначе последние
 * набранные символы теряются вместе с перестроением списка.
 */
export const EditableText = memo(function EditableText({
  value,
  onChange,
  onKeyDown,
  isEditing,
  placeholder,
  multiline,
  readOnly,
  onFocus,
  onBlur,
  className,
  ariaLabel,
}: EditableTextProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [local, setLocal] = useState(value);
  const localRef = useRef(value);
  localRef.current = local;
  const sentRef = useRef(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (localRef.current !== sentRef.current) {
      sentRef.current = localRef.current;
      onChangeRef.current(localRef.current);
    }
  }, []);

  const schedule = useCallback((next: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      sentRef.current = next;
      onChangeRef.current(next);
    }, DEBOUNCE_MS);
  }, []);

  // Правку снаружи (агент, undo, загрузка страницы) подхватываем; собственную,
  // которая уже ушла наверх, — нет, иначе каретка прыгает в конец.
  useEffect(() => {
    if (value === sentRef.current) return;
    sentRef.current = value;
    setLocal(value);
  }, [value]);

  // Поле исчезает при выходе из режима правки, а blur при размонтировании
  // браузером не гарантирован — досылаем несохранённое здесь.
  useEffect(
    () => () => {
      if (!timerRef.current) return;
      clearTimeout(timerRef.current);
      if (localRef.current !== sentRef.current) onChangeRef.current(localRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!isEditing) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    const len = el.value.length;
    el.setSelectionRange(len, len);
  }, [isEditing]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el || !multiline) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [local, isEditing, multiline]);

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const structural =
      e.code === 'Enter' ||
      e.code === 'NumpadEnter' ||
      e.code === 'Tab' ||
      e.code === 'Escape' ||
      ((e.code === 'Backspace' || e.code === 'Delete') && local === '');
    if (structural) flush();
    onKeyDown(e);
  };

  if (!isEditing || readOnly) {
    return (
      <div
        className={className ? `${s.view} ${className}` : s.view}
        data-empty={value ? undefined : 'true'}
        data-readonly={readOnly ? 'true' : undefined}
      >
        {value || (readOnly ? '' : placeholder)}
      </div>
    );
  }

  const common = {
    value: local,
    className: className ? `${s.field} ${className}` : s.field,
    placeholder,
    'aria-label': ariaLabel ?? placeholder,
    onKeyDown: handleKeyDown,
    onFocus,
    onBlur: () => {
      flush();
      onBlur?.();
    },
  };

  return multiline ? (
    <textarea
      {...common}
      ref={(el) => {
        inputRef.current = el;
      }}
      rows={1}
      onChange={(e) => {
        setLocal(e.target.value);
        schedule(e.target.value);
      }}
    />
  ) : (
    <input
      {...common}
      type="text"
      ref={(el) => {
        inputRef.current = el;
      }}
      onChange={(e) => {
        setLocal(e.target.value);
        schedule(e.target.value);
      }}
    />
  );
});
