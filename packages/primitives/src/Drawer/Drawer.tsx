import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ModalOverlay, Modal, Dialog, Heading, Button } from 'react-aria-components';
import * as s from './Drawer.css';

export type DrawerProps = {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  side?: 'right' | 'left';
  title?: string;
  children?: ReactNode;
  /**
   * Разрешить менять ширину, потянув за внутренний край. Без него ширина
   * фиксированная (`min(420px, 92vw)`) и рендер прежний.
   */
  resizable?: boolean;
  /** Управляемая ширина (px). Без неё панель держит ширину сама. */
  width?: number;
  onWidthChange?: (width: number) => void;
  /** Начальная ширина в неуправляемом режиме. */
  defaultWidth?: number;
  min?: number;
  max?: number;
  /** Шаг изменения ширины с клавиатуры. */
  step?: number;
};

/**
 * Боковая панель/оверлей на React Aria (перенос overlayProvider + ModalForm).
 * Бэкдроп — color.overlay + blur, без обводок.
 *
 * `resizable` добавляет шторку у внутреннего края: логика жеста повторяет
 * `ResizablePanel` (ширина от начала жеста, pointer-capture, клавиатура), но
 * шторка живёт ВНУТРИ react-aria `Dialog` — в его FocusScope, доступна с
 * клавиатуры, и не срывает dismiss (Esc уходит в RAC, т.к. onKeyDown гасит
 * только стрелки/Home).
 */
export function Drawer({
  isOpen,
  defaultOpen,
  onOpenChange,
  side = 'right',
  title,
  children,
  resizable,
  width,
  onWidthChange,
  defaultWidth = 420,
  min = 360,
  max = 900,
  step = 16,
}: DrawerProps) {
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

  // Пока тянем — гасим выделение и держим курсор ресайза на всём документе.
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
    // Панель справа: тянем левый край влево (delta<0) → шире. Слева — наоборот.
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
    else return; // прочие клавиши (в т.ч. Esc) уходят в RAC на dismiss
    e.preventDefault();
  };

  const head = (close: () => void) =>
    title ? (
      <div className={s.header}>
        <Heading slot="title" className={s.title}>
          {title}
        </Heading>
        <Button className={s.closeBtn} onPress={close} aria-label="Закрыть">
          ×
        </Button>
      </div>
    ) : null;

  return (
    <ModalOverlay
      className={s.overlay}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      isDismissable
    >
      <Modal
        className={s.modal[side]}
        style={resizable ? { width: current, maxWidth: '92vw' } : undefined}
      >
        {resizable ? (
          <Dialog className={s.panelResizable}>
            {({ close }) => (
              <>
                <div
                  className={`${s.resizeHandle} ${s.handleSide[side]}`}
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Потянуть, чтобы изменить ширину"
                  aria-valuenow={current}
                  aria-valuemin={min}
                  aria-valuemax={max}
                  tabIndex={0}
                  data-dragging={dragging ? 'true' : undefined}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={stop}
                  onPointerCancel={stop}
                  onDoubleClick={() => apply(defaultWidth)}
                  onKeyDown={onKeyDown}
                />
                <div className={s.scroll}>
                  {head(close)}
                  {children}
                </div>
              </>
            )}
          </Dialog>
        ) : (
          <Dialog className={s.panel}>{({ close }) => (
            <>
              {head(close)}
              {children}
            </>
          )}</Dialog>
        )}
      </Modal>
    </ModalOverlay>
  );
}
