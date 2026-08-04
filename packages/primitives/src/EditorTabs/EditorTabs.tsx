import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import * as s from './EditorTabs.css';

export type EditorTab = {
  id: string;
  title: string;
  /** Иконка приходит снаружи — кит не тянет иконочную библиотеку. */
  icon?: ReactNode;
  /**
   * Временная вкладка: рисуется курсивом и заменяется следующей такой же.
   * Приём VS Code — без него беглый просмотр дерева за минуту забивает полосу.
   */
  preview?: boolean;
  /** Нельзя закрыть (например, обязательная вкладка приложения). */
  permanent?: boolean;
};

export type EditorTabsProps = {
  tabs: EditorTab[];
  activeId: string | null;
  onActivate: (id: string) => void;
  onClose?: (id: string) => void;
  /** Закрыть все, кроме указанной. */
  onCloseOthers?: (id: string) => void;
  /** Закрыть всё, что правее указанной. */
  onCloseRight?: (id: string) => void;
  /** Перетаскивание вкладок: id перемещаемой и id той, ПЕРЕД которой встать. */
  onReorder?: (dragId: string, beforeId: string | null) => void;
  className?: string;
};

/**
 * Полоса вкладок открытых документов — как в редакторе кода или в браузере.
 *
 * Компонент презентационный: какие вкладки открыты, какая активна и что
 * происходит при закрытии — решает приложение. Содержимое вкладки он тоже не
 * рендерит: в отличие от `Tabs`, панель здесь живёт снаружи, потому что её
 * обычно надо держать смонтированной даже когда вкладка неактивна (идущий
 * поток, незавершённая генерация).
 */
export function EditorTabs({
  tabs,
  activeId,
  onActivate,
  onClose,
  onCloseOthers,
  onCloseRight,
  onReorder,
  className,
}: EditorTabsProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropId, setDropId] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ id: string; x: number; y: number } | null>(null);

  const close = (id: string) => onClose?.(id);

  return (
    <>
      <div className={className ? `${s.root} ${className}` : s.root} role="tablist">
        {tabs.map((t) => (
          <div
            key={t.id}
            className={s.tab}
            role="tab"
            aria-selected={t.id === activeId}
            tabIndex={0}
            data-active={t.id === activeId ? 'true' : undefined}
            data-preview={t.preview ? 'true' : undefined}
            data-dragging={dragId === t.id ? 'true' : undefined}
            data-drop={dropId === t.id ? 'true' : undefined}
            title={t.title}
            draggable={!!onReorder}
            onDragStart={() => setDragId(t.id)}
            onDragEnd={() => {
              setDragId(null);
              setDropId(null);
            }}
            onDragOver={(e) => {
              if (!dragId || dragId === t.id) return;
              e.preventDefault();
              setDropId(t.id);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragId && dragId !== t.id) onReorder?.(dragId, t.id);
              setDragId(null);
              setDropId(null);
            }}
            onClick={() => onActivate(t.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onActivate(t.id);
              }
            }}
            onAuxClick={(e) => {
              // Средняя кнопка закрывает — как в браузере.
              if (e.button === 1 && !t.permanent) {
                e.preventDefault();
                close(t.id);
              }
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setMenu({ id: t.id, x: e.clientX, y: e.clientY });
            }}
          >
            {t.icon && <span className={s.icon}>{t.icon}</span>}
            <span className={s.label}>{t.title}</span>
            {onClose && !t.permanent && (
              <span
                className={s.close}
                role="button"
                aria-label="Закрыть вкладку"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  close(t.id);
                }}
              >
                ×
              </span>
            )}
          </div>
        ))}
      </div>

      {menu && (
        <TabMenu
          x={menu.x}
          y={menu.y}
          onClose={() => setMenu(null)}
          actions={[
            { label: 'Закрыть', run: () => close(menu.id), hidden: !onClose },
            {
              label: 'Закрыть остальные',
              run: () => onCloseOthers?.(menu.id),
              hidden: !onCloseOthers || tabs.length < 2,
            },
            {
              label: 'Закрыть справа',
              run: () => onCloseRight?.(menu.id),
              hidden:
                !onCloseRight || tabs.findIndex((t) => t.id === menu.id) === tabs.length - 1,
            },
          ]}
        />
      )}
    </>
  );
}

function TabMenu({
  x,
  y,
  actions,
  onClose,
}: {
  x: number;
  y: number;
  actions: { label: string; run: () => void; hidden?: boolean }[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });

  // Кламп после отрисовки: до неё размеры меню неизвестны, а у края экрана
  // оно иначе уезжает за границу.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: Math.min(x, window.innerWidth - r.width - 8),
      y: Math.min(y, window.innerHeight - r.height - 8),
    });
  }, [x, y]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('mousedown', onClose);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClose);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={ref}
      className={s.menu}
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {actions
        .filter((a) => !a.hidden)
        .map((a) => (
          <button
            key={a.label}
            type="button"
            className={s.menuButton}
            onClick={() => {
              a.run();
              onClose();
            }}
          >
            {a.label}
          </button>
        ))}
    </div>,
    document.body,
  );
}
