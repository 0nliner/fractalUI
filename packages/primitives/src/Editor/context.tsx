import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type {
  CustomBlockDef,
  EditorBlockType,
  EditorIconName,
  EditorLanguage,
  EditorPageRef,
  EditorUpload,
} from './types';

// ── Выбор блоков (мультивыделение по Ctrl) ──────────────────────────────────

interface BlockSelection {
  selectedBlockIds: string[];
  toggleBlockSelection: (blockId: string, additive: boolean) => void;
  clearSelection: () => void;
  isBlockSelected: (blockId: string) => boolean;
}

const SelectionContext = createContext<BlockSelection | null>(null);

export function BlockSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedBlockIds, setSelected] = useState<string[]>([]);

  const toggleBlockSelection = useCallback((blockId: string, additive: boolean) => {
    setSelected((prev) => {
      if (!additive) return [blockId];
      return prev.includes(blockId) ? prev.filter((id) => id !== blockId) : [...prev, blockId];
    });
  }, []);

  const clearSelection = useCallback(() => setSelected([]), []);

  const isBlockSelected = useCallback(
    (blockId: string) => selectedBlockIds.includes(blockId),
    [selectedBlockIds],
  );

  const value = useMemo(
    () => ({ selectedBlockIds, toggleBlockSelection, clearSelection, isBlockSelected }),
    [selectedBlockIds, toggleBlockSelection, clearSelection, isBlockSelected],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useBlockSelection(): BlockSelection {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useBlockSelection: нет BlockSelectionProvider выше по дереву');
  return ctx;
}

// ── Возможности редактора (всё, что приложение приносит снаружи) ────────────

/**
 * Приложение-зависимая часть редактора: загрузка файлов, источник страниц,
 * рендер формул и подсветка кода. Кит ничего из этого не умеет сам, поэтому
 * блок, для которого не передан колбэк, не предлагается в меню вставки.
 */
export interface EditorConfig {
  readOnly: boolean;
  /** Режим плиток: блоки раскладываются по 12-колоночной сетке (см. `BlockLayout`). */
  layout: boolean;
  /**
   * Вызывается, когда пользователь берёт блок за ручку-грип (начало drag).
   * Приложение может, например, включить режим плиток. Без него грип работает
   * как раньше (линейный реордер).
   */
  onBlockDragStart?: () => void;
  icons: Record<EditorIconName, ReactNode>;
  languages: EditorLanguage[];
  allowedTypes?: EditorBlockType[];
  /** Плагины кастомных типов блоков приложения (см. `CustomBlockDef`). */
  customBlocks?: CustomBlockDef[];
  onUploadFile?: (file: File) => Promise<EditorUpload>;
  onOpenImage?: (url: string, name: string) => void;
  /**
   * Превратить ссылку блока в адрес, по которому её реально можно показать.
   *
   * Нужно, когда приложение хранит в документе СТАБИЛЬНУЮ ссылку, а отдавать
   * браузеру обязано временную: у подписанных ссылок на хранилище есть срок
   * жизни, и записать такую в текст — значит получить битую картинку через час.
   * Резолвер применяется ТОЛЬКО к атрибуту src; сам блок не меняется и в
   * документ уезжает ровно то, что в нём было.
   *
   * Вернуть `undefined` — «ещё не готово»: редактор покажет ожидание вместо
   * сломанной картинки (так выглядит изображение, которое сейчас генерируется).
   */
  resolveUrl?: (url: string) => string | undefined;
  searchPages?: (query: string) => EditorPageRef[] | Promise<EditorPageRef[]>;
  resolvePageLink?: (pageId: string) => EditorPageRef | undefined;
  onNavigateToPage?: (pageId: string) => void;
  renderFormula?: (latex: string) => ReactNode;
  renderCode?: (code: string, language: string) => ReactNode;
}

const ConfigContext = createContext<EditorConfig | null>(null);

export function EditorConfigProvider({
  config,
  children,
}: {
  config: EditorConfig;
  children: ReactNode;
}) {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useEditorConfig(): EditorConfig {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useEditorConfig: нет EditorConfigProvider выше по дереву');
  return ctx;
}

/** Типы блоков, которые можно вставить при текущем наборе колбэков. */
export function isTypeAvailable(config: EditorConfig, type: EditorBlockType): boolean {
  if (config.allowedTypes && !config.allowedTypes.includes(type)) return false;
  if (type === 'image' || type === 'file') return !!config.onUploadFile;
  if (type === 'formula') return !!config.renderFormula;
  if (type === 'page_link') return !!config.searchPages;
  return true;
}
