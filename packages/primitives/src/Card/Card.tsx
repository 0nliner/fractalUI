import type { HTMLAttributes } from 'react';
import * as s from './Card.css';

export type CardProps = HTMLAttributes<HTMLDivElement>;

/** Карточка-поверхность (surface). Айдентика: тёмная подложка #252525, радиус 14. */
export function Card({ className, ...props }: CardProps) {
  return <div {...props} className={[s.root, className].filter(Boolean).join(' ')} />;
}
