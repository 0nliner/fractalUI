import type { CSSProperties, ReactNode } from 'react';
import * as s from './Feedback.css';

export type SkeletonProps = {
  /** `text` учитывает межстрочный интервал, `block` — произвольный блок. */
  variant?: 'text' | 'block' | 'circle';
  width?: number | string;
  height?: number | string;
  /** Для `text` — сколько строк нарисовать. Последняя короче, как в реальном абзаце. */
  lines?: number;
  style?: CSSProperties;
};

/**
 * Заглушка на время загрузки.
 *
 * Отличается от `Wireframe.Shimmer` назначением: тот — инструмент для макетов
 * (см. скилл fractalui-ux), а этот показывается живому пользователю, пока
 * едут данные. Анимация выключается по `prefers-reduced-motion`.
 */
export function Skeleton({ variant = 'block', width, height, lines = 3, style }: SkeletonProps) {
  if (variant === 'text') {
    return (
      <span className={s.textLines} style={style} aria-hidden>
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className={s.skeleton}
            // Последняя строка короче — иначе блок выглядит как таблица, а не текст.
            style={{ height: '1em', width: i === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      className={variant === 'circle' ? `${s.skeleton} ${s.circle}` : s.skeleton}
      style={{ width, height: height ?? (variant === 'circle' ? width : 16), ...style }}
      aria-hidden
    />
  );
}

export type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Иконка или иллюстрация. */
  icon?: ReactNode;
  /** Кнопка «сбросить фильтры», «добавить товар». */
  action?: ReactNode;
  /** Пустой результат — это не ошибка; для ошибки тон другой. */
  tone?: 'neutral' | 'error';
};

/**
 * Состояние «ничего нет».
 *
 * До него у `AutoTable` и `Feed` был только проп `emptyMessage: string` —
 * ни объяснить причину, ни предложить действие было нельзя. А пустой каталог
 * после фильтра и пустой каталог у нового мастера требуют разных слов.
 */
export function EmptyState({ title, description, icon, action, tone = 'neutral' }: EmptyStateProps) {
  return (
    <div className={s.empty} role={tone === 'error' ? 'alert' : undefined}>
      {icon ? <div className={tone === 'error' ? s.emptyIconError : s.emptyIcon}>{icon}</div> : null}
      <p className={s.emptyTitle}>{title}</p>
      {description ? <p className={s.emptyDescription}>{description}</p> : null}
      {action}
    </div>
  );
}
