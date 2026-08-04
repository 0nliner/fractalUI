import { useState, type ReactNode } from 'react';
import { WireframeProvider } from '@fractalui/primitives';
import * as s from './DesignGallery.css';

export type DesignScreen = {
  key: string;
  /** Подпись во вкладке галереи. */
  label: string;
  icon?: ReactNode;
  /** Заголовок экрана и объяснение, что за раскладка и зачем. */
  title: string;
  description: string;
  render: ReactNode;
};

export type DesignGalleryProps = {
  screens: DesignScreen[];
  /** Ключ экрана по умолчанию. */
  defaultKey?: string;
  labels?: { annotations?: string; skeletons?: string; block?: string; accent?: string };
};

/**
 * Галерея wireframe-макетов.
 *
 * Два обязательных тумблера метода:
 *  - «Аннотации» — скрыть описания блоков и увидеть чистую структуру;
 *  - «Скелетоны» — показать все блоки в состоянии загрузки.
 *
 * Внизу легенда: что означает пунктирная рамка и акцентная заливка. Макеты
 * рисуются примитивами `Block`/`Bar`/`Av`/`Btn` из @fractalui/primitives.
 */
export function DesignGallery({ screens, defaultKey, labels }: DesignGalleryProps) {
  const [key, setKey] = useState(defaultKey ?? screens[0]?.key);
  const [annotate, setAnnotate] = useState(true);
  const [loading, setLoading] = useState(false);
  const screen = screens.find((x) => x.key === key) ?? screens[0];

  const t = {
    annotations: labels?.annotations ?? 'Аннотации',
    skeletons: labels?.skeletons ?? 'Скелетоны',
    block: labels?.block ?? 'блок-болванка',
    accent: labels?.accent ?? 'акцент / CTA',
  };

  if (!screen) return null;

  return (
    <div className={s.root}>
      <div className={s.bar}>
        <div className={s.screens}>
          {screens.map((sc) => (
            <button
              key={sc.key}
              type="button"
              className={sc.key === screen.key ? s.tabActive : s.tab}
              onClick={() => setKey(sc.key)}
            >
              {sc.icon}
              {sc.label}
            </button>
          ))}
        </div>
        <div className={s.toggles}>
          <button
            type="button"
            className={annotate ? s.toggleOn : s.toggle}
            onClick={() => setAnnotate((v) => !v)}
          >
            {t.annotations}
          </button>
          <button
            type="button"
            className={loading ? s.toggleOn : s.toggle}
            onClick={() => setLoading((v) => !v)}
          >
            {t.skeletons}
          </button>
        </div>
      </div>

      {annotate && (
        <div className={s.caption}>
          <h1 className={s.captionTitle}>{screen.title}</h1>
          <p className={s.captionDesc}>{screen.description}</p>
        </div>
      )}

      <div className={s.stage}>
        <WireframeProvider annotate={annotate} loading={loading}>
          {screen.render}
        </WireframeProvider>
      </div>

      <div className={s.legend}>
        <span className={s.legendItem}>
          <span className={s.swatchDashed} /> {t.block}
        </span>
        <span className={s.legendItem}>
          <span className={s.swatchAccent} /> {t.accent}
        </span>
      </div>
    </div>
  );
}
