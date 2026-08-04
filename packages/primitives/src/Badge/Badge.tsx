import type { HTMLAttributes } from 'react';
import * as s from './Badge.css';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: keyof typeof s.tone;
};

/** Бейдж/статус. Presentational, без состояния. */
export function Badge({ tone = 'accent', className, ...props }: BadgeProps) {
  return <span {...props} className={[s.tone[tone], className].filter(Boolean).join(' ')} />;
}
