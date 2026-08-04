import type { CSSProperties, ElementType, ReactNode } from 'react';
import { vars } from '@fractalui/tokens';
import * as s from './Layout.css';

type SpaceToken = keyof typeof vars.space;

type BaseProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
};

/**
 * Раскладочные примитивы.
 *
 * Заводятся потому, что до них каждый отступ и каждая сетка писались руками
 * в `.css.ts` страницы, а значит мимо токенов и мимо адаптива. `gap` здесь
 * принимает только имя токена — произвольное число указать нельзя, и шкала
 * не расползается.
 */

export type StackProps = BaseProps & {
  gap?: SpaceToken;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
};

/** Колонка. */
export function Stack({ gap = 'md', align, justify, as: Tag = 'div', className, style, children }: StackProps) {
  return (
    <Tag
      className={className ? `${s.stack} ${className}` : s.stack}
      style={{ gap: vars.space[gap], alignItems: align, justifyContent: justify, ...style }}
    >
      {children}
    </Tag>
  );
}

export type InlineProps = StackProps & { wrap?: boolean };

/** Строка. По умолчанию переносится: иначе на узком экране контент срезается. */
export function Inline({
  gap = 'md',
  align = 'center',
  justify,
  wrap = true,
  as: Tag = 'div',
  className,
  style,
  children,
}: InlineProps) {
  return (
    <Tag
      className={className ? `${s.inline} ${className}` : s.inline}
      style={{
        gap: vars.space[gap],
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

export type GridProps = BaseProps & {
  gap?: SpaceToken;
  /**
   * Минимальная ширина ячейки. Число колонок браузер считает сам —
   * `repeat(auto-fill, minmax(...))`. Это и есть причина завести компонент:
   * сетка подстраивается без единого медиа-запроса и без брейкпоинтов,
   * причём одинаково и во всю ширину страницы, и в узкой колонке.
   */
  minItem?: number;
};

export function Grid({ gap = 'lg', minItem = 240, as: Tag = 'div', className, style, children }: GridProps) {
  return (
    <Tag
      className={className ? `${s.grid} ${className}` : s.grid}
      style={{
        gap: vars.space[gap],
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${minItem}px, 100%), 1fr))`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

export type ContainerProps = BaseProps & {
  size?: 'md' | 'lg' | 'xl';
};

/** Ограничивает ширину контента и центрирует. Поля — из токенов. */
export function Container({ size = 'lg', as: Tag = 'div', className, style, children }: ContainerProps) {
  const max = size === 'md' ? vars.size.containerMd : size === 'xl' ? vars.size.containerXl : vars.size.containerLg;
  return (
    <Tag className={className ? `${s.container} ${className}` : s.container} style={{ maxWidth: max, ...style }}>
      {children}
    </Tag>
  );
}

export type SectionProps = BaseProps & {
  title?: ReactNode;
  /** Ссылка «смотреть все» или кнопка — в правом верхнем углу. */
  action?: ReactNode;
  description?: ReactNode;
};

/** Секция витрины: заголовок, действие справа, содержимое. */
export function Section({ title, action, description, as: Tag = 'section', className, style, children }: SectionProps) {
  return (
    <Tag className={className ? `${s.section} ${className}` : s.section} style={style}>
      {title || action ? (
        <header className={s.sectionHead}>
          <div>
            {title ? <h2 className={s.sectionTitle}>{title}</h2> : null}
            {description ? <p className={s.sectionDescription}>{description}</p> : null}
          </div>
          {action}
        </header>
      ) : null}
      {children}
    </Tag>
  );
}
