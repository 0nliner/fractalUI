import {
  DialogTrigger,
  Modal,
  ModalOverlay,
  Dialog as AriaDialog,
  Heading,
  Button,
  type ModalOverlayProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import * as s from './Dialog.css';

export type DialogProps = Omit<ModalOverlayProps, 'className' | 'children'> & {
  title?: string;
  /** Функция получает `close` — кнопки внутри должны закрывать окно сами. */
  children: ReactNode | ((opts: { close: () => void }) => ReactNode);
  footer?: ReactNode | ((opts: { close: () => void }) => ReactNode);
  size?: 'sm' | 'md' | 'lg';
  /** Скрыть крестик. Оставлять только если внутри есть явная кнопка закрытия. */
  hideCloseButton?: boolean;
};

/**
 * Центрированное модальное окно.
 *
 * До него в ките был только `Drawer` (боковая шторка) и `ImageLightbox`
 * (просмотр картинки) — подтвердить заказ, удалить товар или отредактировать
 * позицию было нечем.
 *
 * **Ниже `md` окно превращается в нижний лист**: на телефоне центрированное
 * окно перекрывается клавиатурой и заставляет тянуться к середине экрана.
 * Это единственное место в ките, где `max-width` уместен — переключение
 * поведения, а не косметика.
 */
export function Dialog({
  title,
  children,
  footer,
  size = 'md',
  hideCloseButton = false,
  ...props
}: DialogProps) {
  return (
    <ModalOverlay {...props} className={s.overlay} isDismissable>
      <Modal className={`${s.modal} ${s.modalSize[size]}`}>
        <AriaDialog className={s.dialog}>
          {({ close }) => (
            <>
              {title || !hideCloseButton ? (
                <div className={s.header}>
                  {title ? (
                    <Heading slot="title" className={s.title}>
                      {title}
                    </Heading>
                  ) : (
                    <span />
                  )}
                  {hideCloseButton ? null : (
                    <Button onPress={close} className={s.closeBtn} aria-label="Закрыть">
                      ✕
                    </Button>
                  )}
                </div>
              ) : null}
              <div className={s.body}>
                {typeof children === 'function' ? children({ close }) : children}
              </div>
              {footer ? (
                <div className={s.footer}>
                  {typeof footer === 'function' ? footer({ close }) : footer}
                </div>
              ) : null}
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

export { DialogTrigger };
