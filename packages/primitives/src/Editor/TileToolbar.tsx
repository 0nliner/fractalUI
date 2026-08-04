import { useEffect, useRef, useState, type MouseEvent as RMouseEvent, type ReactNode } from 'react';
import type { BlockLayout } from './types';
import * as s from './BlockEditor.css';

export interface TileToolbarProps {
  layout: BlockLayout | undefined;
  onSet: (patch: Partial<BlockLayout>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      {children}
    </svg>
  );
}

const IconLockClosed = <Svg><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>;
const IconLockOpen = <Svg><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 7-2.6" /></Svg>;
const IconScroll = <Svg><rect x="6" y="3" width="12" height="18" rx="3" /><path d="M12 7v4" /></Svg>;
const IconDup = <Svg><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></Svg>;
const IconTrash = <Svg><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /></Svg>;
const IconChevron = <Svg><path d="m6 9 6 6 6-6" /></Svg>;

const WIDTHS: { label: string; span: number; tip: string }[] = [
  { label: '⅓', span: 4, tip: 'Ширина: треть' },
  { label: '½', span: 6, tip: 'Ширина: половина' },
  { label: '⅔', span: 8, tip: 'Ширина: две трети' },
  { label: '▭', span: 12, tip: 'Ширина: вся' },
];

const SCROLL_OPTS: { value: BlockLayout['scroll'] | undefined; label: string }[] = [
  { value: undefined, label: 'Выкл (растёт по контенту)' },
  { value: 'y', label: 'Вертикаль' },
  { value: 'x', label: 'Горизонталь' },
  { value: 'both', label: 'Обе оси' },
];

/**
 * Горизонтальный тулбар под выбранной плиткой: замок (занять область),
 * прокрутка (+ оси), пресеты ширины, высота ±, дублировать/удалить. Каждая
 * кнопка с `title`-тултипом. Клики `stopPropagation`, чтобы не сбросить выбор.
 */
export function TileToolbar({ layout, onSet, onDuplicate, onDelete }: TileToolbarProps) {
  const [scrollOpen, setScrollOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const colSpan = layout?.colSpan ?? 12;
  const rowSpan = layout?.rowSpan ?? 1;
  const locked = !!layout?.locked;
  const scroll = layout?.scroll;

  useEffect(() => {
    if (!scrollOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setScrollOpen(false);
    };
    document.addEventListener('mousedown', onDoc, true);
    return () => document.removeEventListener('mousedown', onDoc, true);
  }, [scrollOpen]);

  const stop = (fn: () => void) => (e: RMouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    fn();
  };

  return (
    <div ref={ref} className={s.tileToolbar} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className={s.tileToolbarBtn}
        data-active={locked ? 'true' : undefined}
        data-tip="Занять область: размер зафиксирован"
        onClick={stop(() => onSet({ locked: !locked }))}
      >
        {locked ? IconLockClosed : IconLockOpen}
      </button>

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          className={s.tileToolbarBtn}
          data-active={scroll ? 'true' : undefined}
          data-tip="Прокрутка: контент скроллится внутри"
          onClick={stop(() => setScrollOpen((o) => !o))}
        >
          {IconScroll}
          {IconChevron}
        </button>
        {scrollOpen && (
          <div className={s.scrollMenu} onClick={(e) => e.stopPropagation()}>
            {SCROLL_OPTS.map((o) => (
              <button
                key={o.label}
                type="button"
                className={s.scrollMenuItem}
                data-active={scroll === o.value ? 'true' : undefined}
                onClick={stop(() => {
                  onSet({ scroll: o.value });
                  setScrollOpen(false);
                })}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <span className={s.tileToolbarSep} />

      {WIDTHS.map((w) => (
        <button
          key={w.span}
          type="button"
          className={s.tileToolbarBtn}
          data-active={colSpan === w.span ? 'true' : undefined}
          data-tip={w.tip}
          onClick={stop(() => onSet({ colSpan: w.span }))}
        >
          {w.label}
        </button>
      ))}

      <span className={s.tileToolbarSep} />

      <button
        type="button"
        className={s.tileToolbarBtn}
        data-tip="Ниже (−1 ряд)"
        onClick={stop(() => onSet({ rowSpan: Math.max(1, rowSpan - 1) }))}
      >
        −
      </button>
      <button
        type="button"
        className={s.tileToolbarBtn}
        data-tip="Выше (+1 ряд)"
        onClick={stop(() => onSet({ rowSpan: rowSpan + 1 }))}
      >
        +
      </button>

      <span className={s.tileToolbarSep} />

      <button type="button" className={s.tileToolbarBtn} data-tip="Дублировать" onClick={stop(onDuplicate)}>
        {IconDup}
      </button>
      <button
        type="button"
        className={s.tileToolbarBtn}
        data-danger="true"
        data-tip="Удалить"
        onClick={stop(onDelete)}
      >
        {IconTrash}
      </button>
    </div>
  );
}
