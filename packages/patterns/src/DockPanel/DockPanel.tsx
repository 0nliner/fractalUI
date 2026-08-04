import { ResizablePanel } from '@fractalui/primitives';
import type { ReactNode } from 'react';
import * as s from './DockPanel.css';

export type DockPanelProps = {
  /** Открыта ли панель. Закрытая остаётся в DOM (display:none) — состояние детей и скролл живы. */
  isOpen: boolean;
  side?: 'right' | 'left';
  /** Управляемая ширина (px). */
  width?: number;
  onWidthChange?: (width: number) => void;
  defaultWidth?: number;
  min?: number;
  max?: number;
  children: ReactNode;
  /** aria-label ручки ресайза. */
  title?: string;
};

/**
 * Постоянная док-панель у края рабочей области (ассистент, инспектор).
 *
 * Стоит РЯДОМ с контентом и сжимает его, а не перекрывает: рендерится в слот
 * `rightDock` каркаса `AppShell`. В отличие от `Drawer` (модальный оверлей с
 * затемнением) — это обычный flex-сосед `main`. Ширину тянет пользователь
 * (ручка от `ResizablePanel`), закрытая панель держится смонтированной.
 */
export function DockPanel({
  isOpen,
  side = 'right',
  width,
  onWidthChange,
  defaultWidth = 420,
  min = 340,
  max = 880,
  children,
  title,
}: DockPanelProps) {
  return (
    <ResizablePanel
      className={s.dock}
      side={side}
      collapsed={!isOpen}
      keepMounted
      width={width}
      onWidthChange={onWidthChange}
      defaultWidth={defaultWidth}
      min={min}
      max={max}
      title={title}
    >
      {children}
    </ResizablePanel>
  );
}
