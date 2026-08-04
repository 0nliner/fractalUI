import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as s from './ResizablePanel.css';

export type ResizablePanelProps = {
  children: ReactNode;
  /** С какой стороны рабочей области стоит панель. Шторка встаёт с внутренней. */
  side?: 'left' | 'right';
  /** Управляемая ширина. Без неё панель держит ширину сама. */
  width?: number;
  onWidthChange?: (width: number) => void;
  defaultWidth?: number;
  min?: number;
  max?: number;
  /** Свёрнута: содержимое и шторка скрыты, место не занимается. */
  collapsed?: boolean;
  /**
   * Свёрнутая панель остаётся в DOM (`display:none`), а не размонтируется:
   * состояние детей и позиция скролла сохраняются между открытиями. Из layout,
   * paint, таб-ордера и AX-дерева поддерево при этом выключено.
   */
  keepMounted?: boolean;
  /** Шаг изменения с клавиатуры. */
  step?: number;
  className?: string;
  title?: string;
};

/**
 * Панель фиксированной ширины со шторкой.
 *
 * Три вещи, из-за которых это компонент кита, а не пара строк на месте:
 *
 * 1. Ширина считается ОТ НАЧАЛА ЖЕСТА, а не от края окна. Приём
 *    `innerWidth - clientX` работает только для панели, прижатой к краю
 *    экрана; внутри сетки (дерево слева от канваса) он даёт мусор.
 * 2. Жест держится на pointer-событиях с захватом. Слушатели мыши на window
 *    не переживают выход курсора за окно и не работают с пером и тачем.
 * 3. Шторка доступна с клавиатуры: `role="separator"`, стрелки двигают,
 *    двойной клик возвращает исходную ширину.
 */
export function ResizablePanel({
  children,
  side = 'left',
  width,
  onWidthChange,
  defaultWidth = 300,
  min = 180,
  max = 720,
  collapsed,
  keepMounted,
  step = 16,
  className,
  title = 'Потянуть, чтобы изменить ширину',
}: ResizablePanelProps) {
  const [inner, setInner] = useState(defaultWidth);
  const [dragging, setDragging] = useState(false);
  const current = width ?? inner;

  const clamp = (v: number) => Math.max(min, Math.min(max, Math.round(v)));
  const apply = (v: number) => {
    const next = clamp(v);
    if (width === undefined) setInner(next);
    onWidthChange?.(next);
  };

  const drag = useRef<{ startX: number; startWidth: number } | null>(null);

  // Пока тянем — гасим выделение текста и держим курсор ресайза на всём
  // документе: иначе жест «подсвечивает» половину интерфейса.
  useEffect(() => {
    if (!dragging) return;
    const prevSelect = document.body.style.userSelect;
    const prevCursor = document.body.style.cursor;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    return () => {
      document.body.style.userSelect = prevSelect;
      document.body.style.cursor = prevCursor;
    };
  }, [dragging]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startWidth: current };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const delta = e.clientX - d.startX;
    apply(side === 'left' ? d.startWidth + delta : d.startWidth - delta);
  };

  const stop = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const grow = side === 'left' ? 'ArrowRight' : 'ArrowLeft';
    const shrink = side === 'left' ? 'ArrowLeft' : 'ArrowRight';
    if (e.key === grow) apply(current + step);
    else if (e.key === shrink) apply(current - step);
    else if (e.key === 'Home') apply(defaultWidth);
    else return;
    e.preventDefault();
  };

  const hidden = Boolean(collapsed);
  // Без keepMounted — прежнее поведение (размонтировать). С keepMounted —
  // остаёмся в DOM, но выключены из раскладки/таб-ордера через display:none.
  if (hidden && !keepMounted) return null;

  const handle = (
    <div
      className={s.handle}
      role="separator"
      aria-orientation="vertical"
      aria-label={title}
      aria-valuenow={current}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      title={title}
      data-dragging={dragging ? 'true' : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
      onDoubleClick={() => apply(defaultWidth)}
      onKeyDown={onKeyDown}
    />
  );

  return (
    <div
      className={className ? `${s.root} ${className}` : s.root}
      style={{ width: hidden ? 0 : current, flexShrink: 0, display: hidden ? 'none' : undefined }}
    >
      {!hidden && side === 'right' && handle}
      <div className={s.body}>{children}</div>
      {!hidden && side === 'left' && handle}
    </div>
  );
}
