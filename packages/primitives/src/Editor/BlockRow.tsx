import {
  memo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type DragEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useBlockSelection, useEditorConfig } from './context';
import { BlockContextMenu, CommandMenu } from './menus';
import { ColorPopover } from './ColorPopover';
import { LayoutHandles } from './LayoutHandles';
import { TileToolbar } from './TileToolbar';
import { CodeBlock } from './blocks/CodeBlock';
import { FileBlock, ImageBlock } from './blocks/MediaBlocks';
import { PageLinkBlock } from './blocks/PageLinkBlock';
import { TableBlock } from './blocks/TableBlock';
import {
  DividerBlock,
  FormulaBlock,
  HeadingBlock,
  ListBlock,
  ParagraphBlock,
  QuoteBlock,
  TodoBlock,
  ToggleBlock,
} from './blocks/TextBlocks';
import * as s from './BlockEditor.css';
import type { BlockLayout, BlockType, BlockViewProps, EditorBlock } from './types';

/** MIME перетаскивания блока: по нему drop отличает блок от файла. */
export const BLOCK_MIME = 'application/x-fractalui-block';

const LIST_TYPES: BlockType[] = ['bulleted_list', 'numbered_list', 'to_do'];
const HEADING_TYPES: BlockType[] = ['heading1', 'heading2', 'heading3'];
const MAX_INDENT = 5;

export interface BlockRowProps {
  block: EditorBlock;
  /** Номер пункта для нумерованного списка. */
  ordinal?: number;
  isFocused: boolean;
  /** Колбэки принимают id, чтобы строка не пересоздавалась на каждый рендер. */
  onFocus: (blockId: string) => void;
  onBlur: (blockId: string) => void;
  onUpdate: (blockId: string, updates: Partial<EditorBlock>) => void;
  onDelete: (blockId: string) => void;
  onAddBlock: (afterBlockId: string, type: BlockType, indent: number) => void;
  onChangeType: (blockId: string, type: BlockType) => void;
  onDuplicate: (blockId: string) => void;
  onMove: (blockId: string, delta: number) => void;
  onDragBlockStart: (blockId: string) => void;
  onDragBlockEnd: () => void;
  onDropBlock: (targetId: string, edge: 'top' | 'bottom') => void;
  dragging: boolean;
  dropEdge?: 'top' | 'bottom';
  onHoverEdge: (targetId: string, edge: 'top' | 'bottom') => void;
  /** Применять geometry сетки (layout-режим ИЛИ у документа есть layout-блоки). */
  gridActive?: boolean;
  /** Плитка выбрана (в layout-режиме) — показать контур и ручки. */
  isTileSelected?: boolean;
  /** Выбрать плитку (клик в layout-режиме). */
  onSelectTile?: (blockId: string) => void;
  /** Переставить блок к плитке под точкой (drag-move в layout). */
  onReorderToPoint?: (sourceId: string, x: number, y: number) => void;
  /** Живой индикатор места вставки во время drag-move (без коммита). */
  onMovePreview?: (sourceId: string, x: number, y: number) => void;
}

export const BlockRow = memo(function BlockRow(props: BlockRowProps) {
  const {
    block,
    ordinal,
    isFocused,
    onFocus,
    onBlur,
    onUpdate,
    onDelete,
    onAddBlock,
    onChangeType,
    onDuplicate,
    onMove,
    onDragBlockStart,
    onDragBlockEnd,
    onDropBlock,
    dragging,
    dropEdge,
    onHoverEdge,
    gridActive,
    isTileSelected,
    onSelectTile,
    onReorderToPoint,
    onMovePreview,
  } = props;

  const { readOnly, layout, icons, customBlocks, onBlockDragStart } = useEditorConfig();
  const { toggleBlockSelection, clearSelection, isBlockSelected } = useBlockSelection();
  const rowRef = useRef<HTMLDivElement>(null);
  const [commandAt, setCommandAt] = useState<{ x: number; y: number } | null>(null);
  const [menuAt, setMenuAt] = useState<{ x: number; y: number } | null>(null);
  // Пипетка блока (цвет текста/фона), открывается из контекст-меню.
  const [colorAt, setColorAt] = useState<{ x: number; y: number; field: 'color' | 'bg' } | null>(null);

  const isEditing = !readOnly && isFocused;
  const indent = block.indent ?? 0;

  // Цвет текста/фона блока — inline, применяется и в readOnly (паритет на сайте).
  const contentStyle: CSSProperties | undefined =
    indent || block.color || block.bg
      ? {
          ...(indent ? { paddingLeft: indent * 16 } : null),
          ...(block.color ? { color: block.color } : null),
          ...(block.bg
            ? {
                background: block.bg,
                borderRadius: 6,
                padding: indent ? `4px 8px 4px ${indent * 16 + 8}px` : '4px 8px',
              }
            : null),
        }
      : undefined;

  // Живое превью ресайза (не коммитим в документ до pointerup — иначе автосейв
  // и undo бьют на каждый шаг).
  const [preview, setPreview] = useState<BlockLayout | null>(null);
  const effLayout = preview ?? block.layout;

  // Геометрия плитки — через CSS-переменные (см. gridCell в CSS): media-запрос
  // должен уметь схлопнуть их на мобиле, а inline gridColumn перекрыть нельзя.
  const gridStyle: CSSProperties | undefined = gridActive
    ? ({
        '--tile-col': effLayout?.colStart ?? 'auto',
        '--tile-col-span': effLayout?.colSpan ?? 12,
        '--tile-row': effLayout?.rowStart ?? 'auto',
        '--tile-row-span': effLayout?.rowSpan ?? 1,
      } as CSSProperties)
    : undefined;
  const focus = () => onFocus(block.id);
  const blur = () => onBlur(block.id);

  // Перемещение плитки (drag-and-drop за ручку в углу): по горизонтали живёт
  // colStart (снап к колонке), по вертикали — переупорядочивание на pointerup.
  const [moving, setMoving] = useState(false);
  const moveRef = useRef<{ startX: number; colStep: number; baseColStart: number; colSpan: number } | null>(null);
  const moveTargetCol = (clientX: number) => {
    const d = moveRef.current;
    if (!d) return block.layout?.colStart ?? 1;
    const dCols = Math.round((clientX - d.startX) / d.colStep);
    return Math.max(1, Math.min(13 - d.colSpan, d.baseColStart + dCols));
  };
  const onMoveDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const grid = rowRef.current?.parentElement;
    if (!grid || !rowRef.current) return;
    const gr = grid.getBoundingClientRect();
    const colGap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    const colStep = (gr.width - 11 * colGap) / 12 + colGap;
    const rr = rowRef.current.getBoundingClientRect();
    const measured = Math.max(1, Math.min(12, Math.round((rr.left - gr.left) / colStep) + 1));
    moveRef.current = {
      startX: e.clientX,
      colStep,
      baseColStart: block.layout?.colStart ?? measured,
      colSpan: block.layout?.colSpan ?? 12,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    setMoving(true);
  };
  const onMoveMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!moveRef.current) return;
    setPreview({ ...block.layout, colStart: moveTargetCol(e.clientX) });
    onMovePreview?.(block.id, e.clientX, e.clientY);
  };
  const onMoveUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!moveRef.current) return;
    const colStart = moveTargetCol(e.clientX);
    moveRef.current = null;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    setMoving(false);
    setPreview(null);
    onUpdate(block.id, { layout: { ...block.layout, colStart } });
    onReorderToPoint?.(block.id, e.clientX, e.clientY);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLInputElement | HTMLTextAreaElement;
    const value = typeof target.value === 'string' ? target.value : '';

    // «/» — это символ, а не хоткей: тут нужен именно e.key, иначе на русской
    // раскладке та же клавиша даёт другой символ.
    if (e.key === '/' && value === '') {
      e.preventDefault();
      const r = rowRef.current?.getBoundingClientRect();
      setCommandAt({ x: r?.left ?? 0, y: (r?.bottom ?? 0) + 4 });
      return;
    }

    if (e.altKey && e.shiftKey && (e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
      e.preventDefault();
      onMove(block.id, e.code === 'ArrowUp' ? -1 : 1);
      return;
    }

    if (e.code === 'Tab') {
      e.preventDefault();
      const next = e.shiftKey ? Math.max(0, indent - 1) : Math.min(MAX_INDENT, indent + 1);
      if (next !== indent) onUpdate(block.id, { indent: next });
      return;
    }

    const isEnter = e.code === 'Enter' || e.code === 'NumpadEnter';

    if (isEnter && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onAddBlock(block.id, LIST_TYPES.includes(block.type) ? block.type : 'paragraph', indent);
      return;
    }

    if (isEnter && !e.shiftKey) {
      if (LIST_TYPES.includes(block.type)) {
        e.preventDefault();
        // Пустой пункт + Enter — выход из списка, как в любом редакторе.
        if (value.trim() === '') onUpdate(block.id, { type: 'paragraph', indent: 0 });
        else onAddBlock(block.id, block.type, indent);
        return;
      }
      if (HEADING_TYPES.includes(block.type)) {
        e.preventDefault();
        onAddBlock(block.id, 'paragraph', indent);
        return;
      }
    }

    if ((e.code === 'Backspace' || e.code === 'Delete') && value === '') {
      e.preventDefault();
      onDelete(block.id);
    }
  };

  const view: BlockViewProps = {
    block,
    onUpdate: (updates) => onUpdate(block.id, updates),
    onKeyDown: handleKeyDown,
    isEditing,
    readOnly,
    onFocus: focus,
    onBlur: blur,
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'heading1':
        return <HeadingBlock {...view} level={1} />;
      case 'heading2':
        return <HeadingBlock {...view} level={2} />;
      case 'heading3':
        return <HeadingBlock {...view} level={3} />;
      case 'bulleted_list':
        return <ListBlock {...view} ordered={false} />;
      case 'numbered_list':
        return <ListBlock {...view} ordered ordinal={ordinal} />;
      case 'to_do':
        return <TodoBlock {...view} />;
      case 'toggle':
        return <ToggleBlock {...view} />;
      case 'code':
        return <CodeBlock {...view} />;
      case 'quote':
        return <QuoteBlock {...view} />;
      case 'divider':
        return <DividerBlock />;
      case 'image':
        return <ImageBlock {...view} />;
      case 'file':
        return <FileBlock {...view} />;
      case 'formula':
        return <FormulaBlock {...view} />;
      case 'table':
        return <TableBlock {...view} />;
      case 'page_link':
        return <PageLinkBlock {...view} />;
      case 'paragraph':
        return <ParagraphBlock {...view} />;
      default: {
        // Неизвестный ките тип — ищем плагин приложения. Не нашли — рисуем как
        // абзац, чтобы правка чужого документа не теряла блок.
        const custom = customBlocks?.find((d) => d.type === block.type);
        if (custom) {
          return custom.render({
            block,
            onChange: (patch) => onUpdate(block.id, patch),
            isEditing,
            readOnly,
          });
        }
        return <ParagraphBlock {...view} />;
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes(BLOCK_MIME)) return; // файл — дело контейнера
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    onHoverEdge(block.id, e.clientY < r.top + r.height / 2 ? 'top' : 'bottom');
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes(BLOCK_MIME)) return;
    e.preventDefault();
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    onDropBlock(block.id, e.clientY < r.top + r.height / 2 ? 'top' : 'bottom');
  };

  return (
    <div
      ref={rowRef}
      className={gridActive ? `${s.row} ${s.gridCell}` : s.row}
      style={gridStyle}
      data-block-id={block.id}
      data-selected={isBlockSelected(block.id) ? 'true' : undefined}
      data-tile-peer={layout && !readOnly && !isTileSelected ? 'true' : undefined}
      data-dragging={dragging ? 'true' : undefined}
      data-drop={dropEdge}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onContextMenu={(e) => {
        // Правый клик по блоку — меню действий (в т.ч. «Размер плитки» в layout).
        if (readOnly) return;
        e.preventDefault();
        setMenuAt({ x: e.clientX, y: e.clientY });
      }}
      onClick={(e) => {
        if (readOnly) return;
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          toggleBlockSelection(block.id, true);
          return;
        }
        clearSelection();
        if (layout) onSelectTile?.(block.id);
        focus();
      }}
    >
      {!readOnly && (
        <button
          type="button"
          className={s.grip}
          title="Перетащить блок или открыть меню"
          aria-label="Меню блока"
          draggable
          onDragStart={(e) => {
            // Взяли блок за грип → приложение может включить режим плиток; тогда
            // же выделяем плитку, чтобы сразу были ручки/тулбар/перемещение.
            if (onBlockDragStart) {
              onBlockDragStart();
              onSelectTile?.(block.id);
            }
            e.dataTransfer.setData(BLOCK_MIME, block.id);
            e.dataTransfer.effectAllowed = 'move';
            if (rowRef.current) e.dataTransfer.setDragImage(rowRef.current, 12, 12);
            onDragBlockStart(block.id);
          }}
          onDragEnd={onDragBlockEnd}
          onClick={(e) => {
            e.stopPropagation();
            const r = e.currentTarget.getBoundingClientRect();
            setMenuAt({ x: r.right + 4, y: r.top });
          }}
        >
          {icons.grip}
        </button>
      )}

      <div
        className={gridActive && effLayout?.scroll ? `${s.content} ${s.contentScroll}` : s.content}
        data-scroll={gridActive && effLayout?.scroll ? effLayout.scroll : undefined}
        style={contentStyle}
      >
        {renderBlock()}
      </div>

      {layout && !readOnly && isTileSelected && (
        <>
          <LayoutHandles
            rowRef={rowRef}
            layout={effLayout}
            locked={effLayout?.locked}
            onPreview={setPreview}
            onCommit={(l) => {
              setPreview(null);
              onUpdate(block.id, { layout: l });
            }}
          />
          <div
            className={s.tileMoveHandle}
            data-moving={moving ? 'true' : undefined}
            data-tip="Перетащите, чтобы переместить плитку"
            role="button"
            aria-label="Переместить плитку"
            onPointerDown={onMoveDown}
            onPointerMove={onMoveMove}
            onPointerUp={onMoveUp}
            onPointerCancel={onMoveUp}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3" />
            </svg>
          </div>
          <TileToolbar
            layout={effLayout}
            onSet={(patch) => onUpdate(block.id, { layout: { ...block.layout, ...patch } })}
            onDuplicate={() => onDuplicate(block.id)}
            onDelete={() => onDelete(block.id)}
          />
        </>
      )}

      {commandAt && (
        <CommandMenu
          x={commandAt.x}
          y={commandAt.y}
          current={block.type}
          onSelect={(type) => {
            onChangeType(block.id, type);
            setCommandAt(null);
            focus();
          }}
          onClose={() => setCommandAt(null)}
        />
      )}

      {menuAt && !readOnly && (
        <BlockContextMenu
          x={menuAt.x}
          y={menuAt.y}
          blockType={block.type}
          language={block.language}
          layout={layout}
          blockLayout={block.layout}
          textColor={block.color}
          bgColor={block.bg}
          onChangeType={(type) => onChangeType(block.id, type)}
          onChangeLanguage={(language) => onUpdate(block.id, { language })}
          onSetLayout={(patch) => onUpdate(block.id, { layout: { ...block.layout, ...patch } })}
          onResetLayout={() => onUpdate(block.id, { layout: undefined })}
          onOpenColor={(field) => {
            if (menuAt) setColorAt({ x: menuAt.x, y: menuAt.y, field });
          }}
          onDuplicate={() => onDuplicate(block.id)}
          onCopy={() => {
            void navigator.clipboard?.writeText(JSON.stringify(block));
          }}
          onDelete={() => onDelete(block.id)}
          onClose={() => setMenuAt(null)}
        />
      )}

      {colorAt && !readOnly && (
        <ColorPopover
          x={colorAt.x}
          y={colorAt.y}
          title={colorAt.field === 'color' ? 'Цвет текста' : 'Цвет фона'}
          value={colorAt.field === 'color' ? block.color : block.bg}
          onChange={(hex) => onUpdate(block.id, { [colorAt.field]: hex })}
          onClose={() => setColorAt(null)}
        />
      )}
    </div>
  );
});
