import * as s from './Pagination.css';

export type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Сколько номеров показывать вокруг текущего. */
  siblings?: number;
};

const GAP = '…';

/**
 * Номера страниц с сокращением середины.
 *
 * `AutoTable` регистрирует только core- и sorted-модели TanStack, то есть
 * пагинации у кита не было вовсе, хотя API отдаёт `Page[T]` с `total`.
 *
 * Ниже `md` номера скрываются и остаются «‹ 3 / 12 ›»: десять кнопок по 44px
 * в строку на телефон не помещаются.
 */
function buildPages(page: number, pageCount: number, siblings: number): (number | typeof GAP)[] {
  // Первая, последняя, окно вокруг текущей — остальное схлопывается.
  const keep = new Set<number>([1, pageCount]);
  for (let p = page - siblings; p <= page + siblings; p++) {
    if (p >= 1 && p <= pageCount) keep.add(p);
  }

  const sorted = [...keep].sort((a, b) => a - b);
  const out: (number | typeof GAP)[] = [];
  let prev = 0;
  for (const p of sorted) {
    // Разрыв ровно в одну страницу многоточием не сокращают — показываем номер.
    if (prev && p - prev === 2) out.push(prev + 1);
    else if (prev && p - prev > 2) out.push(GAP);
    out.push(p);
    prev = p;
  }
  return out;
}

export function Pagination({ page, pageCount, onPageChange, siblings = 1 }: PaginationProps) {
  if (pageCount <= 1) return null;

  const pages = buildPages(page, pageCount, siblings);

  return (
    <nav className={s.root} aria-label="Страницы">
      <button
        type="button"
        className={s.arrow}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Предыдущая страница"
      >
        ‹
      </button>

      <span className={s.compact} aria-hidden>
        {page} / {pageCount}
      </span>

      <span className={s.numbers}>
        {pages.map((p, i) =>
          p === GAP ? (
            <span key={`gap-${i}`} className={s.gap} aria-hidden>
              {GAP}
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={p === page ? `${s.page} ${s.current}` : s.page}
              onClick={() => onPageChange(p)}
              aria-label={`Страница ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ),
        )}
      </span>

      <button
        type="button"
        className={s.arrow}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Следующая страница"
      >
        ›
      </button>
    </nav>
  );
}
