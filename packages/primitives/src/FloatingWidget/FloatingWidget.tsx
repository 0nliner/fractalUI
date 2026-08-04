import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import * as s from './FloatingWidget.css';

export type FloatingWidgetProps = {
  title?: string;
  onClose?: () => void;
  children?: ReactNode;
  defaultX?: number;
  defaultY?: number;
};

/**
 * Перетаскиваемый виджет на framer-motion (перенос FloatingWidget из легаси).
 * Родитель должен быть position: relative.
 */
export function FloatingWidget({ title, onClose, children, defaultX = 0, defaultY = 0 }: FloatingWidgetProps) {
  return (
    <motion.div
      className={s.root}
      drag
      dragMomentum={false}
      initial={{ x: defaultX, y: defaultY }}
    >
      <div className={s.bar}>
        <span className={s.barTitle}>{title}</span>
        {onClose ? (
          <button type="button" className={s.close} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        ) : null}
      </div>
      <div className={s.content}>{children}</div>
    </motion.div>
  );
}
