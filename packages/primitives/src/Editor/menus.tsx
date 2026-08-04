import { useMemo, useState } from 'react';
import { isTypeAvailable, useEditorConfig } from './context';
import { PortalMenu, type MenuOption } from './PortalMenu';
import type { BlockLayout, BlockType, EditorBlockType } from './types';

interface CommandDef {
  type: EditorBlockType;
  label: string;
  description?: string;
}

/** Порядок пунктов = частота использования: заголовки и текст сверху. */
const COMMANDS: CommandDef[] = [
  { type: 'heading1', label: 'Заголовок 1' },
  { type: 'heading2', label: 'Заголовок 2' },
  { type: 'heading3', label: 'Заголовок 3' },
  { type: 'paragraph', label: 'Текст' },
  { type: 'bulleted_list', label: 'Список' },
  { type: 'numbered_list', label: 'Нумерованный' },
  { type: 'to_do', label: 'Задачи' },
  { type: 'toggle', label: 'Сворачиваемый' },
  { type: 'code', label: 'Код' },
  { type: 'table', label: 'Таблица' },
  { type: 'quote', label: 'Цитата' },
  { type: 'image', label: 'Картинка' },
  { type: 'file', label: 'Файл' },
  { type: 'formula', label: 'Формула', description: 'LaTeX' },
  { type: 'page_link', label: 'Ссылка на страницу' },
  { type: 'divider', label: 'Разделитель' },
];

export interface CommandMenuProps {
  x: number;
  y: number;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  /** Текущий тип блока — подсвечивается. */
  current?: BlockType;
  handleEscape?: boolean;
}

/** Меню выбора типа блока (оно же меню вставки по «/»). */
export function CommandMenu({ x, y, onSelect, onClose, current, handleEscape }: CommandMenuProps) {
  const config = useEditorConfig();
  const options = useMemo<MenuOption[]>(() => {
    const builtins = COMMANDS.filter((c) => isTypeAvailable(config, c.type)).map((c) => ({
      id: c.type,
      label: c.label,
      description: c.description,
      icon: config.icons[c.type],
      current: c.type === current,
    }));
    // Кастом-блоки приложения дописываются после встроенных; иконка — из плагина.
    const custom = (config.customBlocks ?? []).map((d) => ({
      id: d.type,
      label: d.label,
      description: d.description,
      icon: d.icon,
      current: d.type === current,
    }));
    return [...builtins, ...custom];
  }, [config, current]);

  return (
    <PortalMenu
      x={x}
      y={y}
      options={options}
      label="Тип блока"
      minWidth={220}
      handleEscape={handleEscape}
      initialIndex={Math.max(
        0,
        options.findIndex((o) => o.current),
      )}
      onSelect={(id) => onSelect(id as BlockType)}
      onClose={onClose}
    />
  );
}

export interface LanguageMenuProps {
  x: number;
  y: number;
  current?: string;
  onSelect: (language: string) => void;
  onClose: () => void;
  handleEscape?: boolean;
}

/** Меню языка для блока кода. */
export function LanguageMenu({ x, y, current, onSelect, onClose, handleEscape }: LanguageMenuProps) {
  const config = useEditorConfig();
  const options = useMemo<MenuOption[]>(
    () => config.languages.map((l) => ({ id: l.id, label: l.label, current: l.id === current })),
    [config.languages, current],
  );

  return (
    <PortalMenu
      x={x}
      y={y}
      options={options}
      label="Язык кода"
      minWidth={170}
      handleEscape={handleEscape}
      initialIndex={Math.max(
        0,
        options.findIndex((o) => o.current),
      )}
      onSelect={onSelect}
      onClose={onClose}
    />
  );
}

export interface LayoutMenuProps {
  x: number;
  y: number;
  layout?: BlockLayout;
  onSet: (patch: Partial<BlockLayout>) => void;
  onReset: () => void;
  onClose: () => void;
  handleEscape?: boolean;
}

const WIDTHS: { label: string; span: number }[] = [
  { label: 'Треть', span: 4 },
  { label: 'Половина', span: 6 },
  { label: 'Две трети', span: 8 },
  { label: 'Вся ширина', span: 12 },
];
const HEIGHTS = [1, 2, 3];

/** Меню размера плитки (пресеты ширины/высоты + выравнивание в сетке + сброс). */
export function LayoutMenu({ x, y, layout, onSet, onReset, onClose, handleEscape }: LayoutMenuProps) {
  const colSpan = layout?.colSpan ?? 12;
  const rowSpan = layout?.rowSpan ?? 1;
  const options: MenuOption[] = [
    ...WIDTHS.map((w) => ({ id: `w:${w.span}`, label: `Ширина: ${w.label}`, current: colSpan === w.span })),
    ...HEIGHTS.map((h) => ({
      id: `h:${h}`,
      label: `Высота: ${h} ${h === 1 ? 'ряд' : 'ряда'}`,
      current: rowSpan === h,
    })),
    ...(colSpan < 12
      ? [
          { id: 'a:left', label: 'В сетке: слева' },
          { id: 'a:center', label: 'В сетке: по центру' },
          { id: 'a:right', label: 'В сетке: справа' },
        ]
      : []),
    { id: 'reset', label: 'Сбросить размер' },
  ];

  const handle = (id: string) => {
    if (id.startsWith('w:')) onSet({ colSpan: Number(id.slice(2)) });
    else if (id.startsWith('h:')) onSet({ rowSpan: Number(id.slice(2)) });
    else if (id === 'a:left') onSet({ colStart: 1 });
    else if (id === 'a:center') onSet({ colStart: Math.max(1, Math.round((12 - colSpan) / 2) + 1) });
    else if (id === 'a:right') onSet({ colStart: 13 - colSpan });
    else if (id === 'reset') onReset();
    onClose();
  };

  return (
    <PortalMenu
      x={x}
      y={y}
      options={options}
      label="Размер плитки"
      minWidth={200}
      handleEscape={handleEscape}
      onSelect={handle}
      onClose={onClose}
    />
  );
}

export interface BlockContextMenuProps {
  x: number;
  y: number;
  blockType: BlockType;
  language?: string;
  /** Режим плиток активен — показывать пункт «Размер плитки». */
  layout?: boolean;
  /** Текущая геометрия плитки (для подсветки активного пресета). */
  blockLayout?: BlockLayout;
  onChangeType: (type: BlockType) => void;
  onChangeLanguage: (language: string) => void;
  onSetLayout?: (patch: Partial<BlockLayout>) => void;
  onResetLayout?: () => void;
  /** Текущий цвет текста/фона (для отметки). */
  textColor?: string;
  bgColor?: string;
  /** Открыть пипетку для цвета текста/фона. */
  onOpenColor?: (field: 'color' | 'bg') => void;
  onDuplicate: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onClose: () => void;
}

/**
 * Меню блока (вызывается кликом по ручке слева).
 *
 * Удаление подтверждается НА МЕСТЕ пункта — второй клик по нему же, без
 * системного окна: `window.confirm` вырывает пользователя из потока.
 */
export function BlockContextMenu({
  x,
  y,
  blockType,
  language,
  layout,
  blockLayout,
  onChangeType,
  onChangeLanguage,
  onSetLayout,
  onResetLayout,
  textColor,
  bgColor,
  onOpenColor,
  onDuplicate,
  onCopy,
  onDelete,
  onClose,
}: BlockContextMenuProps) {
  const [sub, setSub] = useState<'type' | 'language' | 'layout' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const options: MenuOption[] = [
    ...(layout && onSetLayout ? [{ id: 'layout', label: 'Размер плитки', submenu: true }] : []),
    { id: 'type', label: 'Изменить тип', submenu: true },
    ...(blockType === 'code' ? [{ id: 'language', label: 'Язык кода', submenu: true }] : []),
    ...(onOpenColor
      ? [
          { id: 'color-text', label: 'Цвет текста', current: !!textColor },
          { id: 'color-bg', label: 'Цвет фона', current: !!bgColor },
        ]
      : []),
    { id: 'duplicate', label: 'Дублировать' },
    { id: 'copy', label: 'Копировать' },
    {
      id: 'delete',
      label: confirmDelete ? 'Точно удалить?' : 'Удалить',
      danger: true,
    },
  ];

  const handleSelect = (id: string) => {
    if (id === 'layout') {
      setSub('layout');
      return;
    }
    if (id === 'type') {
      setSub('type');
      return;
    }
    if (id === 'language') {
      setSub('language');
      return;
    }
    if (id === 'color-text') {
      onOpenColor?.('color');
      onClose();
      return;
    }
    if (id === 'color-bg') {
      onOpenColor?.('bg');
      onClose();
      return;
    }
    if (id === 'delete') {
      // Первый клик только взводит подтверждение, меню остаётся открытым.
      if (!confirmDelete) {
        setConfirmDelete(true);
        return;
      }
      onDelete();
      onClose();
      return;
    }
    if (id === 'duplicate') onDuplicate();
    if (id === 'copy') onCopy();
    onClose();
  };

  return (
    <>
      <PortalMenu
        x={x}
        y={y}
        options={options}
        label="Действия с блоком"
        // Пока открыто подменю, Esc должен закрывать именно его — один
        // уровень за раз.
        handleEscape={sub === null}
        onSelect={handleSelect}
        onClose={onClose}
      />
      {sub === 'layout' && onSetLayout && (
        <LayoutMenu
          x={x + 190}
          y={y}
          layout={blockLayout}
          onSet={(patch) => {
            onSetLayout(patch);
            setSub(null);
            onClose();
          }}
          onReset={() => {
            onResetLayout?.();
            setSub(null);
            onClose();
          }}
          onClose={() => setSub(null)}
        />
      )}
      {sub === 'type' && (
        <CommandMenu
          x={x + 190}
          y={y}
          current={blockType}
          onSelect={(type) => {
            onChangeType(type);
            setSub(null);
            onClose();
          }}
          onClose={() => setSub(null)}
        />
      )}
      {sub === 'language' && (
        <LanguageMenu
          x={x + 190}
          y={y}
          current={language}
          onSelect={(lang) => {
            onChangeLanguage(lang);
            setSub(null);
            onClose();
          }}
          onClose={() => setSub(null)}
        />
      )}
    </>
  );
}
