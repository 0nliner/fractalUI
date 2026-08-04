import { useEffect, useRef, useState } from 'react';
import { ModalOverlay, Modal, Dialog, Button } from 'react-aria-components';
import * as s from './ImageLightbox.css';

export type ImageLightboxProps = {
  /** Одно изображение. Взаимоисключающе с `images`, но обе формы поддержаны. */
  src?: string;
  /**
   * Галерея: листание внутри просмотрщика. Добавлено для карточки товара —
   * там снимков несколько, и закрывать лайтбокс ради следующего абсурдно.
   */
  images?: string[];
  index?: number;
  onIndexChange?: (index: number) => void;
  alt?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Полноэкранный просмотр изображения (порт imprint-лайтбокса на React Aria):
 * Ctrl+колесо — зум 0.4–8×, перетаскивание — пан, двойной клик — сброс, Esc /
 * клик по фону — закрыть. Бэкдроп/blur/focus-trap — от `ModalOverlay`. Стили —
 * только `vars.*`. Состояние открытия — у владельца (обычно через `onOpenImage`
 * редактора).
 *
 * С `images` работает как галерея: стрелки на экране и с клавиатуры. Прежняя
 * форма с одним `src` не изменилась — расширение аддитивное.
 */
export function ImageLightbox({
  src,
  images,
  index = 0,
  onIndexChange,
  alt,
  isOpen,
  onOpenChange,
}: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const gallery = images && images.length > 0 ? images : null;
  const safeIndex = gallery ? Math.min(Math.max(index, 0), gallery.length - 1) : 0;
  const currentSrc = gallery ? gallery[safeIndex]! : (src ?? '');
  const canNavigate = Boolean(gallery && gallery.length > 1);

  const go = (delta: number) => {
    if (!gallery || !onIndexChange) return;
    // По кругу: на последнем снимке «вперёд» ведёт к первому.
    onIndexChange((safeIndex + delta + gallery.length) % gallery.length);
  };

  // Сбрасываем зум/позицию при открытии и при смене снимка: иначе следующий
  // кадр открывается в чужом масштабе и уехавшим за край.
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPos({ x: 0, y: 0 });
    }
  }, [isOpen, safeIndex]);

  // Стрелки с клавиатуры. Esc и фокус-ловушку берёт на себя ModalOverlay.
  useEffect(() => {
    if (!isOpen || !canNavigate) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  // Ctrl+колесо — зум. Слушатель нативный с {passive:false}, иначе preventDefault
  // не сработает и страница будет зумиться браузером.
  useEffect(() => {
    if (!isOpen) return;
    const el = surfaceRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setScale((v) => Math.min(8, Math.max(0.4, v * (e.deltaY < 0 ? 1.12 : 0.89))));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isOpen]);

  return (
    <ModalOverlay className={s.overlay} isOpen={isOpen} onOpenChange={onOpenChange} isDismissable>
      <Modal className={s.modal}>
        <Dialog className={s.dialog} aria-label={alt || 'Просмотр изображения'}>
          <div
            ref={surfaceRef}
            className={s.surface}
            onClick={(e) => {
              // Клик по пустому фону (не по картинке/тулбару) — закрыть.
              if (e.target === e.currentTarget) onOpenChange(false);
            }}
            onMouseMove={(e) => {
              const d = drag.current;
              if (d) setPos({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) });
            }}
            onMouseUp={() => {
              drag.current = null;
            }}
            onMouseLeave={() => {
              drag.current = null;
            }}
          >
            <div className={s.toolbar}>
              {canNavigate ? (
                <span className={s.zoomReadout}>
                  {safeIndex + 1} / {gallery!.length}
                </span>
              ) : null}
              <span className={s.zoomReadout}>{Math.round(scale * 100)}%</span>
              <Button className={s.closeBtn} onPress={() => onOpenChange(false)} aria-label="Закрыть">
                ×
              </Button>
            </div>
            {canNavigate ? (
              <>
                <Button
                  className={`${s.navBtn} ${s.navPrev}`}
                  onPress={() => go(-1)}
                  aria-label="Предыдущее изображение"
                >
                  ‹
                </Button>
                <Button
                  className={`${s.navBtn} ${s.navNext}`}
                  onPress={() => go(1)}
                  aria-label="Следующее изображение"
                >
                  ›
                </Button>
              </>
            ) : null}
            <div className={s.hintBar}>
              Ctrl + колесо — зум · перетаскивание — двигать · двойной клик — сброс
            </div>
            <img
              className={s.img}
              src={currentSrc}
              alt={alt || ''}
              draggable={false}
              onDoubleClick={() => {
                setScale(1);
                setPos({ x: 0, y: 0 });
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                drag.current = { x: e.clientX, y: e.clientY, ox: pos.x, oy: pos.y };
              }}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                cursor: scale > 1 ? 'grab' : 'default',
                transition: drag.current ? 'none' : 'transform .06s ease-out',
              }}
            />
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
