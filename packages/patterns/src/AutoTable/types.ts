import type { ReactNode } from 'react';

/** Описание колонки AutoTable. Данные приходят через props, не из стора/SDK. */
export type AutoColumn<T> = {
  /** Ключ поля в строке данных. */
  key: keyof T & string;
  /** Заголовок колонки. */
  header: string;
  /** Кастомный рендер ячейки (например, Badge/Avatar). */
  cell?: (row: T) => ReactNode;
  /** Сортируемая ли колонка (по умолчанию true). */
  sortable?: boolean;
  /** Фиксированная ширина в px. */
  width?: number;
};

export type AutoTableProps<T> = {
  columns: AutoColumn<T>[];
  data: T[];
  /** Стабильный id строки (для выбора). */
  getRowId?: (row: T) => string;
  /** Включить выбор строк (чекбоксы). */
  enableSelection?: boolean;
  /** Колбэк при изменении выбора (id выбранных строк). */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Клик по строке. */
  onRowClick?: (row: T) => void;
  /** Текст при пустых данных. */
  emptyMessage?: string;
};
