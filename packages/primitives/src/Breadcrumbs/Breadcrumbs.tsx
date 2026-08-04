import { useRef, useState, type ReactNode } from 'react';
import * as s from './Breadcrumbs.css';

export type BreadcrumbItem = {
  id: string;
  label: string;
  /** Иконка задаётся снаружи — кит не тянет иконочную библиотеку. */
  icon?: ReactNode;
  /** Без обработчика звено остаётся текстом (например, недоступный уровень). */
  onSelect?: () => void;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  /**
   * Сколько звеньев показывать целиком, прежде чем схлопнуть середину.
   * Первое и последние два видны всегда — по ним ориентируются.
   */
  maxVisible?: number;
  separator?: ReactNode;
  className?: string;
};

/**
 * Путь до текущего места.
 *
 * Схлопывание середины — не косметика: путь строится по данным (иерархия
 * локаций), его длина не ограничена, и без сворачивания глубокая ветка
 * выдавила бы всё остальное из строки. Скрытые звенья не теряются — «…»
 * раскрывает их по клику.
 */
export function Breadcrumbs({
  items,
  maxVisible = 4,
  separator = '/',
  className,
}: BreadcrumbsProps) {
  const [expanded, setExpanded] = useState(false);

  // Сброс при смене пути: раскрытая середина оставалась раскрытой и на
  // следующей, более длинной ветке, выдавливая соседей из строки.
  const pathKey = items.map((i) => i.id).join('>');
  const lastKey = useRef(pathKey);
  if (lastKey.current !== pathKey) {
    lastKey.current = pathKey;
    if (expanded) setExpanded(false);
  }

  if (items.length === 0) return null;

  const collapsed = !expanded && items.length > maxVisible;
  // Первое звено + хвост: начало даёт корень, хвост — где мы сейчас.
  const shown: BreadcrumbItem[] = collapsed
    ? [items[0]!, ...items.slice(-(maxVisible - 1))]
    : items;
  const hidden = collapsed ? items.slice(1, -(maxVisible - 1)) : [];

  const render = (it: BreadcrumbItem, isLast: boolean) => (
    <button
      key={it.id}
      type="button"
      className={`${s.crumb} ${isLast ? s.current : ''}`}
      title={it.label}
      // Текущее звено не disabled, а aria-current: disabled выпадает из
      // Tab-обхода и не всплывает title, поэтому «вы здесь» не сообщается
      // ни клавиатурой, ни скринридером.
      aria-current={isLast ? 'page' : undefined}
      aria-disabled={isLast || !it.onSelect ? true : undefined}
      onClick={isLast ? undefined : it.onSelect}
    >
      {it.icon}
      {it.label}
    </button>
  );

  return (
    <nav className={className ? `${s.root} ${className}` : s.root} aria-label="Хлебные крошки">
      {shown.map((it, i) => {
        const isLast = i === shown.length - 1;
        const gap = collapsed && i === 0;
        return (
          <span key={it.id} style={{ display: 'contents' }}>
            {i > 0 && <span className={s.sep}>{separator}</span>}
            {render(it, isLast)}
            {gap && (
              <>
                <span className={s.sep}>{separator}</span>
                <button
                  type="button"
                  className={s.ellipsis}
                  title={hidden.map((h) => h.label).join(' / ')}
                  onClick={() => setExpanded(true)}
                >
                  …
                </button>
              </>
            )}
          </span>
        );
      })}
    </nav>
  );
}
