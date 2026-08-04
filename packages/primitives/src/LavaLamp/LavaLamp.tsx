import { useMemo } from 'react';
import { motion } from 'framer-motion';
import * as s from './LavaLamp.css';

export type LavaLampProps = {
  /** Кол-во пузырей. */
  count?: number;
  /** Цвета пузырей (по умолчанию — фирменные orange/green). */
  colors?: string[];
  /** Прозрачность слоя. */
  opacity?: number;
  className?: string;
};

/**
 * Фирменный анимированный фон fractalUI (лава-лампа). Декоративный, `aria-hidden`.
 * Переписан с нуля: фиксированный массив пузырей + framer-motion, без бага
 * с вызовом хука в цикле (как в легаси).
 */
export function LavaLamp({
  count = 6,
  colors = ['#ff5733', '#33ff57'],
  opacity = 0.55,
  className,
}: LavaLampProps) {
  const blobs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: 180 + Math.round(Math.random() * 220),
        color: colors[i % colors.length],
        left: Math.round(Math.random() * 100),
        top: Math.round(Math.random() * 100),
        duration: 8 + Math.round(Math.random() * 8),
        delay: Math.round(Math.random() * 4),
      })),
    [count, colors],
  );

  return (
    <div className={[s.root, className].filter(Boolean).join(' ')} style={{ opacity }} aria-hidden>
      {blobs.map((b) => (
        <motion.span
          key={b.id}
          className={s.blob}
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            top: `${b.top}%`,
            background: `radial-gradient(circle at 30% 30%, ${b.color}, transparent 70%)`,
          }}
          animate={{ x: [0, 60, -40, 0], y: [0, -50, 40, 0], scale: [1, 1.25, 0.85, 1] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
