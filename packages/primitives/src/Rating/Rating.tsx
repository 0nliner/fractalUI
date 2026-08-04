import * as s from './Rating.css';

export type RatingProps = {
  /** Текущая оценка. Дробная допустима — звезда закрашивается частично. */
  value: number;
  max?: number;
  /** Без `onChange` — только показ, с ним — ввод оценки. */
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  /** Подпись справа: «4,6» или «4,6 · 128 отзывов». */
  label?: string;
};

const STAR =
  'M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.4 6.2 20.45l1.1-6.5-4.7-4.6 6.5-.95z';

/**
 * Звёздный рейтинг — и показ, и ввод.
 *
 * Единственные реализации этого в дереве проектов лежали в CraftSphere
 * (`StarRating` и `CatalogRatingInline`), хотя ничего специфичного для
 * маркетплейса в них нет.
 *
 * Дробное значение важно для показа среднего: 4.6 не должно округляться
 * до пяти звёзд. Закраска идёт по ширине через clip, а не подменой иконки.
 */
export function Rating({ value, max = 5, onChange, size = 'md', label }: RatingProps) {
  const readonly = !onChange;
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div
      className={`${s.root} ${s.sizes[size]}`}
      role={readonly ? 'img' : 'group'}
      aria-label={readonly ? label ?? `Оценка ${value} из ${max}` : 'Оценка'}
    >
      <div className={s.stars}>
        {stars.map((star) => {
          // Доля закраски именно этой звезды: 0, 1 или что-то между.
          const fill = Math.min(1, Math.max(0, value - (star - 1)));
          const Star = (
            <span className={s.star} key={star}>
              <svg viewBox="0 0 24 24" className={s.starIcon} aria-hidden>
                <path d={STAR} className={s.starEmpty} />
              </svg>
              <span className={s.starFillClip} style={{ width: `${fill * 100}%` }}>
                <svg viewBox="0 0 24 24" className={s.starIcon} aria-hidden>
                  <path d={STAR} className={s.starFull} />
                </svg>
              </span>
            </span>
          );

          return readonly ? (
            Star
          ) : (
            <button
              key={star}
              type="button"
              className={s.starButton}
              onClick={() => onChange(star)}
              aria-label={`${star} из ${max}`}
              aria-pressed={value >= star}
            >
              {Star}
            </button>
          );
        })}
      </div>
      {label ? <span className={s.label}>{label}</span> : null}
    </div>
  );
}
