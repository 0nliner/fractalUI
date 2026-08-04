import { memo, useRef, useState } from 'react';
import { useEditorConfig } from '../context';
import * as s from '../BlockEditor.css';
import type { BlockViewProps } from '../types';

/** Общая для картинки и файла кнопка выбора: загрузка живёт в приложении. */
function useUpload(onDone: (url: string, name: string) => void) {
  const { onUploadFile } = useEditorConfig();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (file: File) => {
    if (!onUploadFile) return;
    setError(null);
    setBusy(true);
    try {
      const res = await onUploadFile(file);
      onDone(res.url, res.name);
    } catch {
      setError('Не удалось загрузить');
    } finally {
      setBusy(false);
    }
  };

  return { inputRef, busy, error, pick, enabled: !!onUploadFile };
}

export const ImageBlock = memo(function ImageBlock(p: BlockViewProps) {
  const { icons, onOpenImage, resolveUrl } = useEditorConfig();
  const { inputRef, busy, error, pick, enabled } = useUpload((url, name) =>
    p.onUpdate({ url, name }),
  );

  if (p.block.url) {
    // Показываем разрешённый адрес, а в блоке оставляем исходную ссылку:
    // приложение может хранить в документе стабильный идентификатор, а
    // отдавать браузеру временную подписанную ссылку.
    const src = resolveUrl ? resolveUrl(p.block.url) : p.block.url;
    if (src === undefined) {
      return (
        <div className={s.hint} data-pending="true">
          {icons.busy} {p.block.name || 'Изображение готовится'}
        </div>
      );
    }
    const zoomable = !!onOpenImage;
    return (
      <img
        className={s.image}
        src={src}
        alt={p.block.name || ''}
        data-zoomable={zoomable ? 'true' : 'false'}
        title={zoomable ? 'Открыть в полном размере' : p.block.name || ''}
        onClick={(e) => {
          if (!zoomable) return;
          e.stopPropagation();
          onOpenImage?.(src, p.block.name ?? '');
        }}
      />
    );
  }
  if (p.readOnly || !enabled) return <div className={s.hint}>Изображение не загружено</div>;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void pick(f);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        className={s.ghostButton}
        disabled={busy}
        title="Выбрать изображение с диска"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
      >
        <span className={busy ? s.busy : undefined}>{busy ? icons.busy : icons.image}</span>
        {busy ? 'Загружаю…' : 'Загрузить изображение'}
      </button>
      {error && <span className={s.error}>{error}</span>}
    </div>
  );
});

export const FileBlock = memo(function FileBlock(p: BlockViewProps) {
  const { icons } = useEditorConfig();
  const { inputRef, busy, error, pick, enabled } = useUpload((url, name) =>
    p.onUpdate({ url, name }),
  );

  if (p.block.url) {
    return (
      <a
        className={s.fileLink}
        href={p.block.url}
        download={p.block.name || true}
        title={`Скачать «${p.block.name || 'файл'}»`}
        onClick={(e) => e.stopPropagation()}
      >
        <span className={s.menuIcon}>{icons.file}</span>
        <span className={s.menuLabel}>{p.block.name || 'Файл'}</span>
        <span className={s.menuIcon}>{icons.download}</span>
      </a>
    );
  }
  if (p.readOnly || !enabled) return <div className={s.hint}>Файл не загружен</div>;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void pick(f);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        className={s.ghostButton}
        disabled={busy}
        title="Выбрать файл с диска"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
      >
        <span className={busy ? s.busy : undefined}>{busy ? icons.busy : icons.file}</span>
        {busy ? 'Загружаю…' : 'Прикрепить файл'}
      </button>
      {error && <span className={s.error}>{error}</span>}
    </div>
  );
});
