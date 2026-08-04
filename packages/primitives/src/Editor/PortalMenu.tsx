import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import * as s from './BlockEditor.css';

export interface MenuOption {
  id: string;
  label: string;
  icon?: ReactNode;
  description?: string;
  /** Текущее значение — подсвечивается акцентом. */
  current?: boolean;
  danger?: boolean;
  /** Пункт раскрывает вложенное меню — рисуем стрелку справа. */
  submenu?: boolean;
}

export interface PortalMenuProps {
  x: number;
  y: number;
  options: MenuOption[];
  onSelect: (id: string) => void;
  onClose: () => void;
  /** Какой пункт подсвечен при открытии. */
  initialIndex?: number;
  /**
   * Обрабатывать ли Esc. Меню с открытым подменю выключает свой обработчик,
   * чтобы Esc разматывал ровно один уровень за раз.
   */
  handleEscape?: boolean;
  minWidth?: number;
  label?: string;
}

/**
 * Плоское меню у курсора: портал в body, клампится по вьюпорту, ходит
 * стрелками и закрывается по Esc.
 *
 * Esc слушается в capture-фазе со `stopImmediatePropagation` — иначе глобальные
 * хоткеи приложения (выход из режима, снятие выбора) съедят событие раньше.
 * Клик мимо закрывает только тогда, когда он мимо ВСЕХ меню: подменю рисуется
 * отдельным порталом и не должно ронять родителя.
 */
export function PortalMenu({
  x,
  y,
  options,
  onSelect,
  onClose,
  initialIndex = 0,
  handleEscape = true,
  minWidth,
  label,
}: PortalMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });
  const [active, setActive] = useState(initialIndex);

  // Кламп считается после отрисовки: до неё размеры меню неизвестны.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: Math.max(8, Math.min(x, window.innerWidth - r.width - 8)),
      y: Math.max(8, Math.min(y, window.innerHeight - r.height - 8)),
    });
  }, [x, y]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        // Гасим полностью: иначе стрелка заодно двигает каретку в поле,
        // из которого меню и открыли.
        e.preventDefault();
        e.stopImmediatePropagation();
        setActive((i) => (options.length ? (i + 1) % options.length : 0));
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setActive((i) => (options.length ? (i - 1 + options.length) % options.length : 0));
      } else if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        const opt = options[active];
        if (opt) {
          e.preventDefault();
          e.stopImmediatePropagation();
          onSelect(opt.id);
        }
      } else if (e.code === 'Escape' && handleEscape) {
        e.preventDefault();
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [options, active, onSelect, onClose, handleEscape]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target && target.closest('[data-editor-menu="true"]')) return;
      onClose();
    };
    window.addEventListener('mousedown', onDown, true);
    return () => window.removeEventListener('mousedown', onDown, true);
  }, [onClose]);

  const activeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return createPortal(
    <div
      ref={ref}
      className={s.menu}
      role="menu"
      aria-label={label}
      data-editor-menu="true"
      style={{ left: pos.x, top: pos.y, minWidth }}
    >
      {options.map((o, i) => (
        <button
          key={o.id}
          ref={i === active ? activeRef : undefined}
          type="button"
          role="menuitem"
          className={s.menuRow}
          data-active={i === active ? 'true' : undefined}
          data-current={o.current ? 'true' : undefined}
          data-danger={o.danger ? 'true' : undefined}
          title={o.description ? `${o.label} — ${o.description}` : o.label}
          onMouseEnter={() => setActive(i)}
          onClick={() => onSelect(o.id)}
        >
          {o.icon ? <span className={s.menuIcon}>{o.icon}</span> : null}
          <span className={s.menuLabel}>{o.label}</span>
          {o.description ? <span className={s.menuDesc}>{o.description}</span> : null}
          {o.submenu ? <span className={s.menuDesc}>▸</span> : null}
        </button>
      ))}
    </div>,
    document.body,
  );
}
