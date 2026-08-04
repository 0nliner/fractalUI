import type { ReactNode } from 'react';
import type { AutoColumn, FeedField, ObjectSchema, AutoFormValues } from '@fractalui/patterns';

/** Строка данных страницы (в проде — типы из сгенерённого hey-api SDK). */
export type UnknownRow = Record<string, unknown>;

/** Действие «создать»: открывает форму (AutoForm) из JSON-схемы. */
export type CreateAction = {
  label: string;
  schema: ObjectSchema;
  onSubmit: (values: AutoFormValues) => void;
};

export type Visualization =
  | { type: 'table'; columns: AutoColumn<UnknownRow>[] }
  | { type: 'feed'; fields: FeedField<UnknownRow>[] };

/** Описание страницы приложения (рантайм-форма, гетерогенные строки). */
export type PageConfig = {
  key: string;
  title: string;
  icon?: ReactNode;
  visualization: Visualization;
  /** Данные страницы. В примере — мок; в проде сюда подставляется data-адаптер. */
  data: UnknownRow[];
  createAction?: CreateAction;
};

export type AppConfig = {
  brand?: { title?: string; logo?: ReactNode };
  pages: PageConfig[];
};

// --- Типобезопасное авторство страниц -------------------------------------

export type TypedVisualization<T extends UnknownRow> =
  | { type: 'table'; columns: AutoColumn<T>[] }
  | { type: 'feed'; fields: FeedField<T>[] };

export type TypedPage<T extends UnknownRow> = {
  key: string;
  title: string;
  icon?: ReactNode;
  visualization: TypedVisualization<T>;
  data: T[];
  createAction?: CreateAction;
};

/**
 * Хелпер для типобезопасного описания страницы под конкретный тип строки `T`,
 * возвращающий унифицированный рантайм-`PageConfig`.
 */
export function definePage<T extends UnknownRow>(page: TypedPage<T>): PageConfig {
  return page as unknown as PageConfig;
}
