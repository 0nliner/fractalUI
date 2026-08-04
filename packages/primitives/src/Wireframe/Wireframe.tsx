import { createContext, useContext, type ReactNode } from 'react';
import * as s from './Wireframe.css';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WIREFRAME — примитивы макетов-«болванок»
 * ─────────────────────────────────────────────────────────────────────────────
 *  Метод: макет НЕ должен выглядеть готовым продуктом, иначе на ревью обсуждают
 *  шрифты вместо структуры. Поэтому в макете нет работающих элементов — только
 *  серые заглушки.
 *
 *  Реальным текстом пишутся ТОЛЬКО: названия блоков, их описания и подписи
 *  навигации. Весь остальной контент — Bar / Av / Btn / Stack / Field.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Режим галереи: показывать описания блоков и/или скелетоны загрузки. */
export const WireframeContext = createContext<{ annotate: boolean; loading: boolean }>({
  annotate: true,
  loading: false,
});

export function WireframeProvider({
  annotate = true,
  loading = false,
  children,
}: {
  annotate?: boolean;
  loading?: boolean;
  children: ReactNode;
}) {
  return (
    <WireframeContext.Provider value={{ annotate, loading }}>{children}</WireframeContext.Provider>
  );
}

/** Серая полоса — строка текста. */
export function Bar({
  w = '100%',
  h = 8,
  className,
}: {
  w?: string | number;
  h?: number;
  className?: string;
}) {
  return <div className={[s.bar, className].filter(Boolean).join(' ')} style={{ width: w, height: h }} />;
}

/** Серый круг — аватар или иконка сущности. */
export function Av({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <div
      className={[s.avatar, className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
    />
  );
}

/** Прямоугольник — кнопка. accent — для CTA. */
export function Btn({ w = 72, h = 24, accent }: { w?: number; h?: number; accent?: boolean }) {
  return <div className={accent ? s.buttonAccent : s.button} style={{ width: w, height: h }} />;
}

/** Несколько полос убывающей ширины — абзац или список. */
export function Stack({ rows = 3, h = 8 }: { rows?: number; h?: number }) {
  return (
    <div className={s.stack}>
      {Array.from({ length: rows }).map((_, i) => (
        <Bar key={i} w={`${90 - i * 12}%`} h={h} />
      ))}
    </div>
  );
}

/** Пульсирующая версия — состояние загрузки. */
export function Shimmer({ rows = 3, avatar = false }: { rows?: number; avatar?: boolean }) {
  return (
    <div className={s.shimmer}>
      {avatar && <Av />}
      <div className={s.shimmerBody}>
        {Array.from({ length: rows }).map((_, i) => (
          <Bar key={i} w={`${85 - i * 10}%`} h={9} />
        ))}
      </div>
    </div>
  );
}

/** Поле ввода-болванка. Именно болванка: настоящий input в макете запрещён. */
export function Field({
  w = '100%',
  h = 28,
  hint,
}: {
  w?: string | number;
  h?: number;
  hint?: string;
}) {
  return (
    <div className={s.field} style={{ width: w, height: h }}>
      {hint}
    </div>
  );
}

export type BlockProps = {
  /** Номер блока — на него ссылаются в обсуждении макета. */
  n: number;
  title: string;
  /** Зачем этот блок и на что референс. Скрывается тумблером «Аннотации». */
  desc: string;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Сколько строк показать в режиме скелетонов. */
  skel?: number;
  skelAvatar?: boolean;
};

/**
 * Аннотированный блок макета: пунктирная рамка, номер, название и описание.
 * В режиме `loading` (из WireframeProvider) вместо содержимого — Shimmer.
 */
export function Block({ n, title, desc, children, className, style, skel = 3, skelAvatar }: BlockProps) {
  const { annotate, loading } = useContext(WireframeContext);
  return (
    <section className={[s.block, className].filter(Boolean).join(' ')} style={style}>
      <div className={s.blockHead}>
        <span className={s.blockNum}>{n}</span>
        <span className={s.blockTitle}>{title}</span>
      </div>
      {annotate && <p className={s.blockDesc}>{desc}</p>}
      <div className={s.blockBody}>
        {loading ? <Shimmer rows={skel} avatar={skelAvatar} /> : children}
      </div>
    </section>
  );
}

/** 12-колоночная сетка мастер-страницы. Блоки задают свой span через style/className. */
export function MasterGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={[s.masterGrid, className].filter(Boolean).join(' ')}>{children}</div>;
}

/** Хелпер: занять N из 12 колонок. */
export function span(n: number): React.CSSProperties {
  return { gridColumn: `span ${n} / span ${n}` };
}
