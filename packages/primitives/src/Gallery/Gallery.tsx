import { useState } from 'react';
import { ImageLightbox } from '../ImageLightbox/ImageLightbox';
import * as s from './Gallery.css';

export type GalleryProps = {
  images: string[];
  alt?: string;
  /** Соотношение сторон главного кадра, например `'4 / 3'`. */
  aspectRatio?: string;
  /** Что показать, когда изображений нет: заглушка каталога. */
  fallback?: React.ReactNode;
};

/**
 * Главное изображение + лента превью, по клику — полноэкранный просмотр.
 *
 * `ImageLightbox` умел показывать ровно один снимок, а карточке товара нужна
 * галерея. Обвязка вокруг него и живёт здесь: выбор кадра, превью, передача
 * массива в просмотрщик.
 *
 * На телефоне лента превью прокручивается вбок с привязкой — вертикальный
 * список съел бы весь экран.
 */
export function Gallery({ images, alt, aspectRatio = '4 / 3', fallback }: GalleryProps) {
  const [index, setIndex] = useState(0);
  const [isOpen, setOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className={s.main} style={{ aspectRatio }}>
        {fallback ?? <div className={s.placeholder} aria-hidden />}
      </div>
    );
  }

  const safeIndex = Math.min(index, images.length - 1);

  return (
    <div className={s.root}>
      <button
        type="button"
        className={s.main}
        style={{ aspectRatio }}
        onClick={() => setOpen(true)}
        aria-label="Открыть изображение во весь экран"
      >
        <img className={s.mainImg} src={images[safeIndex]} alt={alt ?? ''} />
      </button>

      {images.length > 1 ? (
        <div className={s.thumbs}>
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              className={i === safeIndex ? `${s.thumb} ${s.thumbActive}` : s.thumb}
              onClick={() => setIndex(i)}
              aria-label={`Изображение ${i + 1} из ${images.length}`}
              aria-current={i === safeIndex}
            >
              <img className={s.thumbImg} src={src} alt="" />
            </button>
          ))}
        </div>
      ) : null}

      <ImageLightbox
        images={images}
        index={safeIndex}
        onIndexChange={setIndex}
        alt={alt}
        isOpen={isOpen}
        onOpenChange={setOpen}
      />
    </div>
  );
}
