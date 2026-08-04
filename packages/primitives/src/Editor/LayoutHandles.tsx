import { useRef, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import type { BlockLayout } from './types';
import * as s from './BlockEditor.css';

type Edge = 'top' | 'right' | 'bottom' | 'left';
const EDGES: Edge[] = ['top', 'right', 'bottom', 'left'];
const clamp = (min: number, max: number, v: number) => Math.max(min, Math.min(max, v));

export interface LayoutHandlesProps {
  /** Ссылка на строку-плитку (её родитель — grid-контейнер). */
  rowRef: RefObject<HTMLDivElement>;
  /** Текущая геометрия плитки. */
  layout: BlockLayout | undefined;
  /** Залочена («занять область») — контур есть, ручки скрыты. */
  locked?: boolean;
  /** Живое превью во время жеста (без коммита в документ). */
  onPreview: (l: BlockLayout) => void;
  /** Коммит один раз на pointerup. */
  onCommit: (l: BlockLayout) => void;
}

/**
 * Оверлей выбранной плитки: primary-контур + круглые ручки на центрах граней
 * (стиль «нового Android»). Право → ширина (colSpan), лево → левый край
 * (colStart+colSpan), низ/верх → высота (rowSpan). Шаг снапится к колонкам/рядам
 * сетки. Контейнер `pointer-events:none` (каретка/выделение целы), интерактивны
 * только сами ручки.
 */
export function LayoutHandles({ rowRef, layout, locked, onPreview, onCommit }: LayoutHandlesProps) {
  const drag = useRef<{
    edge: Edge;
    startX: number;
    startY: number;
    colStep: number;
    rowStep: number;
    base: { colSpan: number; rowSpan: number; colStart: number };
  } | null>(null);
  const preview = useRef<BlockLayout>(layout ?? {});

  const measure = () => {
    const row = rowRef.current;
    const grid = row?.parentElement;
    if (!row || !grid) return null;
    const gr = grid.getBoundingClientRect();
    const cs = getComputedStyle(grid);
    const colGap = parseFloat(cs.columnGap) || 0;
    const rowGap = parseFloat(cs.rowGap) || 0;
    // Шаг колонки ОБЯЗАН включать gap, иначе снап съезжает на широких сетках.
    const colStep = (gr.width - 11 * colGap) / 12 + colGap;
    const rowStep = 40 + rowGap; // базовая единица gridAutoRows
    const rr = row.getBoundingClientRect();
    const measuredColStart = clamp(1, 12, Math.round((rr.left - gr.left) / colStep) + 1);
    return { colStep, rowStep, measuredColStart };
  };

  const start = (edge: Edge) => (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const m = measure();
    if (!m) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      edge,
      startX: e.clientX,
      startY: e.clientY,
      colStep: m.colStep,
      rowStep: m.rowStep,
      base: {
        colSpan: layout?.colSpan ?? 12,
        rowSpan: layout?.rowSpan ?? 1,
        colStart: layout?.colStart ?? m.measuredColStart,
      },
    };
    document.body.style.userSelect = 'none';
    document.body.style.cursor = edge === 'left' || edge === 'right' ? 'ew-resize' : 'ns-resize';
  };

  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dCols = Math.round((e.clientX - d.startX) / d.colStep);
    const dRows = Math.round((e.clientY - d.startY) / d.rowStep);
    const next: BlockLayout = { ...(layout ?? {}) };
    if (d.edge === 'right') {
      next.colSpan = clamp(1, 12, d.base.colSpan + dCols);
    } else if (d.edge === 'left') {
      const rightEdge = d.base.colStart + d.base.colSpan; // фиксируем правый край
      const ns = clamp(1, rightEdge - 1, d.base.colStart + dCols);
      next.colStart = ns;
      next.colSpan = rightEdge - ns;
    } else if (d.edge === 'bottom') {
      next.rowSpan = Math.max(1, d.base.rowSpan + dRows);
    } else if (d.edge === 'top') {
      next.rowSpan = Math.max(1, d.base.rowSpan - dRows);
    }
    preview.current = next;
    onPreview(next);
  };

  const stop = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    drag.current = null;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    onCommit(preview.current);
  };

  return (
    <div className={s.tileOverlay} data-locked={locked ? 'true' : undefined} aria-hidden>
      {!locked &&
        EDGES.map((edge) => (
          <div
            key={edge}
            role="slider"
            aria-label={`Изменить размер плитки: ${edge}`}
            className={`${s.tileHandle} ${s.handleEdge[edge]}`}
            onPointerDown={start(edge)}
            onPointerMove={move}
            onPointerUp={stop}
            onPointerCancel={stop}
          />
        ))}
    </div>
  );
}
