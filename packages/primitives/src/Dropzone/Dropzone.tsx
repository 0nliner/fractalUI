import { DropZone, FileTrigger, Text, Button } from 'react-aria-components';
import type { ReactNode } from 'react';
import * as s from './Dropzone.css';

export type DropzoneProps = {
  /** Файлы отданы наружу. Загрузку и прогресс делает потребитель — L1 не ходит в сеть. */
  onFiles: (files: File[]) => void;
  /** Список MIME/расширений для нативного диалога, например `['image/*']`. */
  acceptedFileTypes?: string[];
  allowsMultiple?: boolean;
  isDisabled?: boolean;
  label?: string;
  hint?: string;
  /** Своё содержимое вместо подписи — например сетка уже загруженных превью. */
  children?: ReactNode;
};

/**
 * Зона перетаскивания файлов.
 *
 * Сознательно НЕ умеет загружать: ни прогресса, ни запросов, ни URL. Отдаёт
 * `File[]` наружу и на этом заканчивается — по правилу L1 «primitives не знает
 * про сеть и стор». Загрузчик с прогрессом собирается поверх, в приложении,
 * и поднимется в кит паттерном, когда обкатается на втором потребителе.
 *
 * Кнопка выбора обязательна и не декоративна: drag-and-drop недоступен
 * с клавиатуры и не существует на мобильных.
 */
export function Dropzone({
  onFiles,
  acceptedFileTypes,
  allowsMultiple = true,
  isDisabled,
  label = 'Перетащите файлы сюда',
  hint,
  children,
}: DropzoneProps) {
  return (
    <DropZone
      className={s.zone}
      isDisabled={isDisabled}
      onDrop={async (e) => {
        const files = await Promise.all(
          e.items
            .filter((item): item is Extract<typeof item, { kind: 'file' }> => item.kind === 'file')
            .map((item) => item.getFile()),
        );
        if (files.length) onFiles(allowsMultiple ? files : files.slice(0, 1));
      }}
    >
      {children ?? (
        <>
          <Text slot="label" className={s.label}>
            {label}
          </Text>
          {hint ? <span className={s.hint}>{hint}</span> : null}
        </>
      )}
      <FileTrigger
        acceptedFileTypes={acceptedFileTypes}
        allowsMultiple={allowsMultiple}
        onSelect={(list) => {
          if (list) onFiles(Array.from(list));
        }}
      >
        <Button className={s.button} isDisabled={isDisabled}>
          Выбрать файлы
        </Button>
      </FileTrigger>
    </DropZone>
  );
}
