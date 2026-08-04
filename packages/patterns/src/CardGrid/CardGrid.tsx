import type { ReactNode } from 'react';
import { EmptyState, Grid, Pagination, Skeleton } from '@fractalui/primitives';
import * as s from './CardGrid.css';

export type CardGridProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
  isLoading?: boolean;
  error?: ReactNode;
  /** Что показать при пустом результате. Строкой нельзя: нужна ещё и кнопка. */
  empty?: ReactNode;
  /** Сколько скелетонов рисовать, пока едут данные. */
  skeletonCount?: number;
  minItem?: number;
  /** Пагинация появляется только когда страниц больше одной. */
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
};

/**
 * Сетка карточек со всеми четырьмя состояниями и пагинацией.
 *
 * Каждый список витрины — это она: каталог, «похожие», товары мастера, заказы.
 * `Feed` из кита рисует только успешный случай и берёт поля плоским списком,
 * а карточка товара — со своей вёрсткой, ценой и действиями — так не строится.
 *
 * Загрузка показывается скелетонами той же сетки, а не спиннером по центру:
 * так не прыгает раскладка, когда данные приезжают.
 */
export function CardGrid<T>({
  items,
  renderItem,
  getKey,
  isLoading = false,
  error,
  empty,
  skeletonCount = 8,
  minItem = 240,
  page,
  pageCount,
  onPageChange,
}: CardGridProps<T>) {
  if (error) {
    return <EmptyState tone="error" title="Не удалось загрузить" description={error} />;
  }

  if (isLoading) {
    return (
      <Grid minItem={minItem}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div key={i} className={s.skeletonCard}>
            <Skeleton variant="block" height={160} />
            <Skeleton variant="text" lines={2} />
          </div>
        ))}
      </Grid>
    );
  }

  if (items.length === 0) {
    return <>{empty ?? <EmptyState title="Ничего не найдено" />}</>;
  }

  return (
    <div className={s.root}>
      <Grid minItem={minItem}>
        {items.map((item, i) => (
          <div key={getKey(item, i)} className={s.cell}>
            {renderItem(item, i)}
          </div>
        ))}
      </Grid>
      {page && pageCount && onPageChange ? (
        <Pagination page={page} pageCount={pageCount} onPageChange={onPageChange} />
      ) : null}
    </div>
  );
}
