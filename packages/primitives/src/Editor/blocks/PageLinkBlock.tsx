import { memo, useEffect, useRef, useState } from 'react';
import { useEditorConfig } from '../context';
import * as s from '../BlockEditor.css';
import type { BlockViewProps, EditorPageRef } from '../types';

/**
 * Ссылка на другую страницу приложения.
 *
 * Кит не знает ни про стор страниц, ни про роутер: список даёт `searchPages`,
 * заголовок текущей цели — `resolvePageLink`, переход — `onNavigateToPage`.
 * Заголовок дублируется в `content`, чтобы ссылка оставалась читаемой там, где
 * резолвер недоступен (экспорт в markdown, режим просмотра).
 */
export const PageLinkBlock = memo(function PageLinkBlock(p: BlockViewProps) {
  const { icons, searchPages, resolvePageLink, onNavigateToPage } = useEditorConfig();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<EditorPageRef[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  const targetId = p.block.target_page_id;
  const resolved = targetId && resolvePageLink ? resolvePageLink(targetId) : undefined;
  const title = resolved?.title || p.block.content || '';
  const dead = !targetId || (!!resolvePageLink && !resolved);
  const editable = p.isEditing && !p.readOnly && !!searchPages;

  useEffect(() => {
    if (editable) setOpen(true);
  }, [editable]);

  useEffect(() => {
    if (!open || !searchPages) return;
    let alive = true;
    const timer = setTimeout(() => {
      void (async () => {
        const res = await searchPages(query);
        if (alive) setItems(res);
      })();
    }, 150);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [open, query, searchPages]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (target && boxRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Escape') return;
      e.stopImmediatePropagation();
      setOpen(false);
    };
    window.addEventListener('mousedown', onDown, true);
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('mousedown', onDown, true);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  if (editable) {
    return (
      <div className={s.pickerAnchor} ref={boxRef}>
        <button
          type="button"
          className={s.pickerButton}
          title="Выбрать страницу для ссылки"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
        >
          <span className={s.menuIcon}>{icons.page_link}</span>
          <span className={s.menuLabel}>{title || 'Выберите страницу'}</span>
          <span className={s.menuIcon}>{icons.expanded}</span>
        </button>
        {open && (
          <div className={s.picker} data-editor-menu="true">
            <input
              className={s.pickerSearch}
              type="text"
              value={query}
              autoFocus
              placeholder="Поиск страницы"
              aria-label="Поиск страницы"
              onChange={(e) => setQuery(e.target.value)}
            />
            {items.length === 0 ? (
              <div className={s.hint}>Ничего не найдено</div>
            ) : (
              items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  className={s.menuRow}
                  data-current={it.id === targetId ? 'true' : undefined}
                  onClick={() => {
                    p.onUpdate({ target_page_id: it.id, content: it.title });
                    setOpen(false);
                  }}
                >
                  <span className={s.menuLabel}>{it.title}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <span
      className={s.pageLink}
      data-dead={dead ? 'true' : undefined}
      title={
        dead
          ? 'Ссылка не ведёт на существующую страницу'
          : `Перейти на «${title || 'страницу'}»`
      }
      onClick={(e) => {
        if (dead || !targetId || !onNavigateToPage) return;
        e.stopPropagation();
        onNavigateToPage(targetId);
      }}
    >
      <span className={s.menuIcon}>{icons.page_link}</span>
      {title || 'Ссылка на страницу'}
    </span>
  );
});
