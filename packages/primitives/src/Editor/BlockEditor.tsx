import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import {
  BlockSelectionProvider,
  EditorConfigProvider,
  useBlockSelection,
  useEditorConfig,
  type EditorConfig,
} from './context';
import { BlockRow } from './BlockRow';
import { defaultIcons } from './icons';
import { createBlockId } from './ids';
import * as s from './BlockEditor.css';
import type {
  BlockType,
  CustomBlockDef,
  EditorBlock,
  EditorBlockType,
  EditorIcons,
  EditorLanguage,
  EditorPageRef,
  EditorUpload,
} from './types';

/** Языки блока кода по умолчанию; заменяется пропом `languages`. */
const DEFAULT_LANGUAGES: EditorLanguage[] = [
  { id: 'plaintext', label: 'Обычный текст' },
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'json', label: 'JSON' },
  { id: 'yaml', label: 'YAML' },
  { id: 'sql', label: 'SQL' },
  { id: 'bash', label: 'Bash' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'cpp', label: 'C++' },
  { id: 'csharp', label: 'C#' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'markdown', label: 'Markdown' },
];

export interface BlockEditorProps {
  /** Содержимое документа. Пустой массив показывает один пустой абзац. */
  value: EditorBlock[];
  onChange: (blocks: EditorBlock[]) => void;
  /** Подсказка в пустом документе. */
  placeholder?: string;
  readOnly?: boolean;
  /**
   * Режим плиток: блоки раскладываются по 12-колоночной сетке и получают ручки
   * ресайза/перемещения (см. `BlockLayout`, `block.layout`). Без пропа — обычный
   * линейный редактор. Геометрия рендерится одинаково в edit и readOnly.
   */
  layout?: boolean;
  /**
   * Вызывается при начале drag блока за грип. Напр., приложение включает режим
   * плиток (`layout`), когда пользователь берётся за ручку. Без пропа — прежнее
   * поведение (грип просто переставляет блоки).
   */
  onBlockDragStart?: () => void;
  /** Показать тонкий тулбар редактора (кнопка «На весь экран»). */
  toolbar?: boolean;
  /** Поставить каретку в первый блок при монтировании. */
  autoFocus?: boolean;
  className?: string;
  /** Разрешённые типы блоков. По умолчанию — все, что поддержаны колбэками. */
  allowedTypes?: EditorBlockType[];
  /**
   * Плагины кастомных типов блоков: приложение объявляет свой блок (рендер +
   * иконка в меню «/» + начальные данные), не трогая ядро редактора. Без этого
   * пропа поведение прежнее. См. `CustomBlockDef`.
   */
  customBlocks?: CustomBlockDef[];
  /** Языки для блока кода. */
  languages?: EditorLanguage[];
  /** Иконки приложения (в наших продуктах — lucide-react). */
  icons?: EditorIcons;
  /** Загрузка файла. Без неё блоки «Картинка» и «Файл» недоступны. */
  onUploadFile?: (file: File) => Promise<EditorUpload>;
  /** Открыть картинку в полном размере (лайтбокс приложения). */
  onOpenImage?: (url: string, name: string) => void;
  /** Ссылка блока → показываемый адрес. `undefined` — «ещё не готово». */
  resolveUrl?: (url: string) => string | undefined;
  /** Поиск страниц. Без него блок «Ссылка на страницу» недоступен. */
  searchPages?: (query: string) => EditorPageRef[] | Promise<EditorPageRef[]>;
  /** Заголовок страницы по id — чтобы ссылка показывала свежее название. */
  resolvePageLink?: (pageId: string) => EditorPageRef | undefined;
  /** Переход по ссылке на страницу. */
  onNavigateToPage?: (pageId: string) => void;
  /** Рендер формулы (KaTeX приложения). Без него блок «Формула» недоступен. */
  renderFormula?: (latex: string) => ReactNode;
  /** Подсветка кода в режиме просмотра. Без неё код рисуется как есть. */
  renderCode?: (code: string, language: string) => ReactNode;
}

interface BodyProps {
  value: EditorBlock[];
  onChange: (blocks: EditorBlock[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  toolbar?: boolean;
  className?: string;
}

/** Иконки тулбара (kit-внутренние, без иконочной либы). */
const ExpandIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
);
const MinimizeIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
  </svg>
);

const EditorBody = memo(function EditorBody({
  value,
  onChange,
  placeholder,
  autoFocus,
  toolbar,
  className,
}: BodyProps) {
  const { readOnly, layout, onUploadFile, icons, customBlocks } = useEditorConfig();
  const { selectedBlockIds, clearSelection } = useBlockSelection();
  const [focusedId, setFocusedId] = useState<string | null>(null);
  // Выбранная плитка (layout-режим) — для неё показываются контур и ручки.
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const onSelectTile = useCallback((id: string) => setSelectedTileId(id), []);
  const [fullscreen, setFullscreen] = useState(false);

  // Esc выходит из полноэкранного режима (если не открыто меню — оно закрывается само).
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Escape') return;
      if (document.querySelector('[data-editor-menu="true"]')) return;
      setFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropAt, setDropAt] = useState<{ id: string; edge: 'top' | 'bottom' } | null>(null);
  const [fileOver, setFileOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Пустой блок создаётся один раз: uuid прямо в рендере давал бы новый id на
  // каждую перерисовку, и каретка теряла бы блок при первом же вводе.
  const [emptyBlock] = useState<EditorBlock>(() => ({
    id: createBlockId(),
    type: 'paragraph',
    content: '',
  }));

  const blocks = value.length > 0 ? value : [emptyBlock];

  // Геометрию сетки применяем, если включён режим плиток ИЛИ хоть у одного блока
  // есть layout — тогда расставленные плитки выглядят одинаково и в обычном
  // режиме (просто без разметки/ручек). `layout`-проп управляет только
  // редакторским хромом (направляющие/контуры/ручки/тулбар/выбор).
  const hasLayout = useMemo(() => blocks.some((b) => !!b.layout), [blocks]);
  const gridActive = layout || hasLayout;

  // Зеркало списка: обработчики читают актуальные блоки, а не замыкание —
  // иначе быстрый ввод затирает предыдущие правки.
  const rootRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<EditorBlock[]>(blocks);
  blocksRef.current = blocks;

  const commit = useCallback(
    (next: EditorBlock[]) => {
      // Ref обновляем синхронно: следующий обработчик в этом же событии
      // (сброс текста → вставка блока) должен видеть уже новое состояние.
      blocksRef.current = next;
      onChange(next);
    },
    [onChange],
  );

  const autoFocusDone = useRef(false);
  useEffect(() => {
    if (!autoFocus || autoFocusDone.current) return;
    autoFocusDone.current = true;
    setFocusedId(blocksRef.current[0]?.id ?? null);
  }, [autoFocus]);

  const focusBlock = useCallback((id: string) => setFocusedId(id), []);
  const blurBlock = useCallback(
    (id: string) => setFocusedId((cur) => (cur === id ? null : cur)),
    [],
  );
  const hoverEdge = useCallback(
    (id: string, edge: 'top' | 'bottom') => setDropAt({ id, edge }),
    [],
  );
  const dragEnd = useCallback(() => {
    setDragId(null);
    setDropAt(null);
  }, []);

  // Esc разматывает по одному уровню: сначала открытое меню (оно слушает само),
  // потом выход из правки блока. Слушаем в capture-фазе со
  // stopImmediatePropagation, иначе глобальные хоткеи приложения съедят Esc
  // раньше и выйдут сразу из режима целиком.
  useEffect(() => {
    if (!focusedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Escape') return;
      if (document.querySelector('[data-editor-menu="true"]')) return;
      e.stopImmediatePropagation();
      setFocusedId(null);
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [focusedId]);

  const handleUpdate = useCallback(
    (blockId: string, updates: Partial<EditorBlock>) => {
      commit(blocksRef.current.map((b) => (b.id === blockId ? { ...b, ...updates } : b)));
    },
    [commit],
  );

  const handleDelete = useCallback(
    (blockId: string) => {
      const current = blocksRef.current;
      const idx = current.findIndex((b) => b.id === blockId);
      let next = current.filter((b) => b.id !== blockId);
      if (next.length === 0) next = [{ id: createBlockId(), type: 'paragraph', content: '' }];
      commit(next);
      // Каретка уходит на предыдущий блок, чтобы не теряться после удаления.
      setFocusedId((idx > 0 ? current[idx - 1]?.id : next[0]?.id) ?? null);
    },
    [commit],
  );

  const handleDeleteSelected = useCallback(() => {
    let next = blocksRef.current.filter((b) => !selectedBlockIds.includes(b.id));
    if (next.length === 0) next = [{ id: createBlockId(), type: 'paragraph', content: '' }];
    commit(next);
    clearSelection();
  }, [commit, selectedBlockIds, clearSelection]);

  // Начальные поля кастом-блока при вставке/смене типа. Для встроенных типов
  // плагина нет — сид пустой, поведение прежнее.
  const seedFor = useCallback(
    (type: BlockType) => customBlocks?.find((d) => d.type === type)?.defaultData?.() ?? {},
    [customBlocks],
  );

  const handleAdd = useCallback(
    (afterBlockId: string, type: BlockType, indent: number) => {
      const current = blocksRef.current;
      const at = current.findIndex((b) => b.id === afterBlockId) + 1;
      const block: EditorBlock = {
        content: '',
        ...seedFor(type),
        id: createBlockId(),
        type,
        indent,
      };
      commit([...current.slice(0, at), block, ...current.slice(at)]);
      setFocusedId(block.id);
    },
    [commit, seedFor],
  );

  const handleChangeType = useCallback(
    (blockId: string, type: BlockType) => {
      const seed = seedFor(type);
      commit(blocksRef.current.map((b) => (b.id === blockId ? { ...b, ...seed, type } : b)));
    },
    [commit, seedFor],
  );

  const handleDuplicate = useCallback(
    (blockId: string) => {
      const current = blocksRef.current;
      const idx = current.findIndex((b) => b.id === blockId);
      const src = current[idx];
      if (!src) return;
      const copy: EditorBlock = { ...src, id: createBlockId() };
      commit([...current.slice(0, idx + 1), copy, ...current.slice(idx + 1)]);
      setFocusedId(copy.id);
    },
    [commit],
  );

  const handleMove = useCallback(
    (blockId: string, delta: number) => {
      const current = blocksRef.current;
      const from = current.findIndex((b) => b.id === blockId);
      const to = from + delta;
      const a = current[from];
      const b = current[to];
      if (from < 0 || !a || !b) return;
      const next = [...current];
      next[from] = b;
      next[to] = a;
      commit(next);
    },
    [commit],
  );

  const handleDropBlock = useCallback(
    (targetId: string, edge: 'top' | 'bottom') => {
      setDropAt(null);
      setDragId(null);
      if (!dragId || dragId === targetId) return;
      const current = blocksRef.current;
      const moved = current.find((b) => b.id === dragId);
      if (!moved) return;
      const without = current.filter((b) => b.id !== dragId);
      const at = without.findIndex((b) => b.id === targetId) + (edge === 'bottom' ? 1 : 0);
      if (at < 0) return;
      commit([...without.slice(0, at), moved, ...without.slice(at)]);
    },
    [commit, dragId],
  );

  // Перемещение плитки drag-and-drop (layout): цель = БЛИЖАЙШАЯ по 2D-расстоянию
  // плитка (не требуем прямого попадания курсором в чужую строку — иначе внутри
  // высокой плитки, в зазорах сетки и ниже всех блоков цель не находилась и
  // перемещение «не срабатывало» для части блоков).
  const findDropTarget = useCallback(
    (sourceId: string, x: number, y: number): { id: string; edge: 'top' | 'bottom' } | null => {
      const scope = rootRef.current ?? document;
      const rows = Array.from(scope.querySelectorAll<HTMLElement>('[data-block-id]'));
      let bestId: string | null = null;
      let bestDist = Infinity;
      let edge: 'top' | 'bottom' = 'bottom';
      for (const el of rows) {
        const id = el.dataset.blockId;
        if (!id || id === sourceId) continue;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // Вертикаль весомее горизонтали: перемещение мыслится как «выше/ниже».
        const dist = (cx - x) ** 2 + ((cy - y) * 2) ** 2;
        if (dist < bestDist) {
          bestDist = dist;
          bestId = id;
          edge = y < cy ? 'top' : 'bottom';
        }
      }
      return bestId ? { id: bestId, edge } : null;
    },
    [],
  );

  // Живой индикатор места вставки во время перетаскивания плитки.
  const [moveDrop, setMoveDrop] = useState<{ id: string; edge: 'top' | 'bottom' } | null>(null);
  const previewDropTarget = useCallback(
    (sourceId: string, x: number, y: number) => setMoveDrop(findDropTarget(sourceId, x, y)),
    [findDropTarget],
  );

  const reorderToPoint = useCallback(
    (sourceId: string, x: number, y: number) => {
      setMoveDrop(null);
      const drop = findDropTarget(sourceId, x, y);
      if (!drop) return;
      const current = blocksRef.current;
      const moved = current.find((b) => b.id === sourceId);
      if (!moved) return;
      const without = current.filter((b) => b.id !== sourceId);
      const at = without.findIndex((b) => b.id === drop.id) + (drop.edge === 'bottom' ? 1 : 0);
      if (at < 0) return;
      commit([...without.slice(0, at), moved, ...without.slice(at)]);
    },
    [commit, findDropTarget],
  );

  const handleAddAtEnd = useCallback(() => {
    const last = blocksRef.current[blocksRef.current.length - 1];
    // Пустой абзац в конце не плодим — просто ставим в него каретку.
    if (last && last.type === 'paragraph' && last.content === '') {
      setFocusedId(last.id);
      return;
    }
    const block: EditorBlock = { id: createBlockId(), type: 'paragraph', content: '' };
    commit([...blocksRef.current, block]);
    setFocusedId(block.id);
  }, [commit]);

  // Delete удаляет выделенные блоки — но только когда фокус не в поле ввода.
  useEffect(() => {
    if (readOnly || selectedBlockIds.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.code !== 'Delete' || typing) return;
      e.preventDefault();
      e.stopPropagation();
      handleDeleteSelected();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [readOnly, selectedBlockIds, handleDeleteSelected]);

  const insertMedia = useCallback(
    (created: EditorBlock[]) => {
      const current = blocksRef.current;
      const idx = focusedId ? current.findIndex((b) => b.id === focusedId) : -1;
      const at = idx === -1 ? current.length : idx + 1;
      commit([...current.slice(0, at), ...created, ...current.slice(at)]);
    },
    [commit, focusedId],
  );

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    if (readOnly || !onUploadFile) return;
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    e.preventDefault();
    setFileOver(false);
    setUploading(true);
    void (async () => {
      try {
        for (const file of files) {
          const up = await onUploadFile(file);
          insertMedia([
            {
              id: createBlockId(),
              type: file.type.startsWith('image/') ? 'image' : 'file',
              content: '',
              url: up.url,
              name: up.name,
            },
          ]);
        }
      } finally {
        setUploading(false);
      }
    })();
  };

  // Нумерация пунктов: счёт идёт по подряд идущим numbered_list одного отступа.
  const ordinals = useMemo(() => {
    const map: Record<string, number> = {};
    const counters: number[] = [];
    for (const b of blocks) {
      const level = b.indent ?? 0;
      if (b.type !== 'numbered_list') {
        counters.length = 0;
        continue;
      }
      counters.length = level + 1;
      counters[level] = (counters[level] ?? 0) + 1;
      map[b.id] = counters[level] ?? 1;
    }
    return map;
  }, [blocks]);

  const isEmpty = blocks.length === 1 && !blocks[0]?.content;

  const body = (
    <div
      ref={rootRef}
      className={[s.root, gridActive && s.gridRoot, className].filter(Boolean).join(' ')}
      onDragOver={(e) => {
        if (readOnly || !onUploadFile) return;
        if (!e.dataTransfer.types.includes('Files')) return;
        e.preventDefault();
        setFileOver(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setFileOver(false);
      }}
      onDrop={handleFileDrop}
      onClick={(e) => {
        // Клик по фону сетки снимает выбор плитки (прячет ручки).
        if (layout && e.target === e.currentTarget) setSelectedTileId(null);
      }}
    >
      {(fileOver || uploading) && (
        <div className={s.dropZone}>
          <span className={uploading ? s.busy : undefined}>
            {uploading ? icons.busy : icons.upload}
          </span>
          {uploading ? 'Загружаю…' : 'Отпустите — вставлю картинку или файл'}
        </div>
      )}

      {layout && !readOnly && (
        <div className={s.guideOverlay} aria-hidden>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className={s.guideCol} />
          ))}
        </div>
      )}

      {blocks.map((block) => (
        <BlockRow
          key={block.id}
          block={block}
          ordinal={ordinals[block.id]}
          isFocused={focusedId === block.id}
          onFocus={focusBlock}
          onBlur={blurBlock}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onAddBlock={handleAdd}
          onChangeType={handleChangeType}
          onDuplicate={handleDuplicate}
          onMove={handleMove}
          onDragBlockStart={setDragId}
          onDragBlockEnd={dragEnd}
          onDropBlock={handleDropBlock}
          onHoverEdge={hoverEdge}
          dragging={dragId === block.id}
          dropEdge={
            dropAt?.id === block.id
              ? dropAt.edge
              : moveDrop?.id === block.id
                ? moveDrop.edge
                : undefined
          }
          gridActive={gridActive}
          isTileSelected={layout ? selectedTileId === block.id : false}
          onSelectTile={onSelectTile}
          onReorderToPoint={reorderToPoint}
          onMovePreview={previewDropTarget}
        />
      ))}

      {!readOnly && (
        <div
          className={s.addArea}
          style={gridActive ? { gridColumn: '1 / -1' } : undefined}
          onClick={handleAddAtEnd}
        >
          {isEmpty ? placeholder ?? 'Начните печатать, «/» — список команд' : ''}
        </div>
      )}
    </div>
  );

  if (!toolbar) return body;

  const shell = (
    <>
      <div className={s.toolbar}>
        <button
          type="button"
          className={s.toolbarBtn}
          onClick={() => setFullscreen((f) => !f)}
          title={fullscreen ? 'Свернуть' : 'На весь экран'}
        >
          {fullscreen ? MinimizeIcon : ExpandIcon}
          <span>{fullscreen ? 'Свернуть' : 'На весь экран'}</span>
        </button>
      </div>
      {body}
    </>
  );

  // Полноэкран — фикс-оверлей через портал в body (НЕ native Fullscreen API,
  // иначе document.body-порталы меню/ручек оказались бы под фуллскрин-элементом).
  return fullscreen ? createPortal(<div className={s.fullscreenOverlay}>{shell}</div>, document.body) : shell;
});

/**
 * Блочный редактор документа (абзацы, заголовки, списки, код, таблицы, медиа).
 *
 * Компонент презентационный: он не ходит в сеть и не знает про стор. Всё
 * прикладное приходит колбэками — загрузка файлов, источник страниц для ссылок,
 * рендер формул, подсветка кода. Блок, для которого колбэк не передан, просто
 * не предлагается в меню вставки, но уже существующее содержимое такого блока
 * рисуется (в упрощённом виде), чтобы правка чужого документа ничего не теряла.
 */
export function BlockEditor({
  value,
  onChange,
  placeholder,
  readOnly,
  layout,
  onBlockDragStart,
  toolbar,
  autoFocus,
  className,
  allowedTypes,
  customBlocks,
  languages,
  icons,
  onUploadFile,
  onOpenImage,
  resolveUrl,
  searchPages,
  resolvePageLink,
  onNavigateToPage,
  renderFormula,
  renderCode,
}: BlockEditorProps) {
  const config = useMemo<EditorConfig>(
    () => ({
      readOnly: !!readOnly,
      layout: !!layout,
      onBlockDragStart,
      icons: { ...defaultIcons, ...icons },
      languages: languages ?? DEFAULT_LANGUAGES,
      allowedTypes,
      customBlocks,
      onUploadFile,
      onOpenImage,
      resolveUrl,
      searchPages,
      resolvePageLink,
      onNavigateToPage,
      renderFormula,
      renderCode,
    }),
    [
      readOnly,
      layout,
      onBlockDragStart,
      icons,
      languages,
      allowedTypes,
      customBlocks,
      onUploadFile,
      onOpenImage,
      resolveUrl,
      searchPages,
      resolvePageLink,
      onNavigateToPage,
      renderFormula,
      renderCode,
    ],
  );

  return (
    <EditorConfigProvider config={config}>
      <BlockSelectionProvider>
        <EditorBody
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          toolbar={toolbar}
          className={className}
        />
      </BlockSelectionProvider>
    </EditorConfigProvider>
  );
}
