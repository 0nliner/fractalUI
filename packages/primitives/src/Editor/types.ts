import type { KeyboardEvent, ReactNode } from 'react';

/** Тип блока. Набор закрыт: редактор умеет рисовать только известные ему типы. */
export type EditorBlockType =
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'paragraph'
  | 'bulleted_list'
  | 'numbered_list'
  | 'to_do'
  | 'toggle'
  | 'code'
  | 'quote'
  | 'divider'
  | 'image'
  | 'file'
  | 'formula'
  | 'table'
  | 'page_link';

/**
 * Тип блока в документе: известный ките тип ИЛИ произвольная строка кастом-блока
 * приложения (см. `CustomBlockDef`). `(string & {})` держит автодополнение по
 * известным литералам, но не запрещает свои типы. Кит рисует известные сам,
 * неизвестные отдаёт зарегистрированному `CustomBlockDef.render`.
 */
export type BlockType = EditorBlockType | (string & {});

/** Выравнивание колонки таблицы; `null` — по умолчанию (влево). */
export type CellAlign = 'left' | 'center' | 'right' | null;

/**
 * Геометрия плитки на 12-колоночной сетке (режим `layout`). Все поля
 * опциональны: дефолт — `colSpan:12` auto-flow, что даёт обычный линейный
 * редактор. `colStart`/`rowStart` не заданы → авто-размещение. Значения — целые
 * ячейки сетки (не px), поэтому раскладка отзывчива и одинакова в readOnly.
 */
export interface BlockLayout {
  /** Ширина в колонках 1–12 (дефолт 12). */
  colSpan?: number;
  /** Высота в рядах ≥1 (дефолт 1). */
  rowSpan?: number;
  /** Стартовая колонка 1–12; не задана — авто-поток. */
  colStart?: number;
  /** Стартовый ряд ≥1; не задан — авто-поток. */
  rowStart?: number;
  /** «Занять область»: размер зафиксирован, ручки ресайза скрыты. */
  locked?: boolean;
  /** Прокрутка контента внутри rowSpan-области по осям (дефолт при включении — `'y'`). */
  scroll?: 'x' | 'y' | 'both';
}

/**
 * Единица содержимого. Одна плоская запись на блок: вложенность выражается
 * полем `indent`, а не деревом — так проще и сохранять, и переупорядочивать.
 */
export interface EditorBlock {
  id: string;
  type: BlockType;
  content: string;
  /** Дочерние блоки `toggle` (показываются только в развёрнутом состоянии). */
  children?: EditorBlock[];
  /** `to_do`: отметка выполнения. */
  checked?: boolean;
  /** `toggle`: свёрнут ли блок. */
  collapsed?: boolean;
  /** `code`: идентификатор языка. */
  language?: string;
  /** Порядок в исходном хранилище приложения; редактор его не трогает. */
  order?: number;
  /** Уровень отступа, 0–5. */
  indent?: number;
  /** `image` / `file`: ссылка на загруженный ресурс. */
  url?: string;
  /** `image` / `file`: отображаемое имя. */
  name?: string;
  /** `table`: rows[0] — строка заголовка. */
  rows?: string[][];
  /** `table`: выравнивание по колонкам. */
  align?: CellAlign[];
  /** `page_link`: идентификатор целевой страницы в приложении. */
  target_page_id?: string;
  /** Геометрия плитки в режиме `layout` (12-колоночная сетка). */
  layout?: BlockLayout;
  /** Цвет текста блока (любой CSS-цвет, обычно hex). Применяется inline, readOnly-паритет. */
  color?: string;
  /** Цвет фона блока (любой CSS-цвет, обычно hex). Применяется inline, readOnly-паритет. */
  bg?: string;
  /**
   * Произвольные данные кастом-блока. Ядро кита их не интерпретирует, только
   * сохраняет losslessly (спреды в редакторе). `CustomBlockDef.render` читает и
   * пишет сюда через `onChange({ data })`.
   */
  data?: Record<string, unknown>;
}

/** Внутренний контракт: что редактор передаёт конкретному блоку. */
export interface BlockViewProps {
  block: EditorBlock;
  onUpdate: (updates: Partial<EditorBlock>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
  isEditing: boolean;
  readOnly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

/** Что кит передаёт `CustomBlockDef.render` при отрисовке кастом-блока. */
export interface CustomBlockRenderProps {
  /** Текущий блок (читай `block.data`, `block.content`). */
  block: EditorBlock;
  /** Записать правку блока. Обычно `onChange({ data: { ...block.data, ...} })`. */
  onChange: (patch: Partial<EditorBlock>) => void;
  /** Блок в фокусе и документ редактируемый — можно показывать поля ввода. */
  isEditing: boolean;
  /** Документ только для чтения. */
  readOnly?: boolean;
}

/**
 * Плагин кастомного блока: приложение объявляет свой тип блока (рендер +
 * редактирование + иконка в меню вставки), не трогая ядро редактора. Передаётся
 * в `BlockEditor` пропом `customBlocks`. Диспетчеризация по `type`: блок с
 * неизвестным ките `type` ищется среди `customBlocks` и рисуется через `render`;
 * не найден — падает в абзац (правка чужого документа ничего не теряет).
 *
 * Аддитивно: без `customBlocks` поведение редактора прежнее.
 */
export interface CustomBlockDef {
  /** Значение `block.type`, за которое отвечает плагин (напр. `'task_params'`). */
  type: string;
  /** Подпись пункта в меню вставки «/». */
  label: string;
  /** Второстепенная подпись в меню (как у встроенных, напр. «LaTeX»). */
  description?: string;
  /** Иконка пункта меню. Кит иконки не тянет — приходит от приложения. */
  icon?: ReactNode;
  /** Начальные поля блока при вставке/смене типа (обычно `{ data: {...} }`). */
  defaultData?: () => Partial<EditorBlock>;
  /** Отрисовка блока (и просмотр, и правка — по `isEditing`/`readOnly`). */
  render: (props: CustomBlockRenderProps) => ReactNode;
}

/** Результат загрузки файла: что вернуло приложение. */
export interface EditorUpload {
  url: string;
  name: string;
}

/** Страница, на которую можно поставить ссылку блоком `page_link`. */
export interface EditorPageRef {
  id: string;
  title: string;
}

/** Язык для блока кода. */
export interface EditorLanguage {
  id: string;
  label: string;
}

/** Имена иконок, которые редактор рисует. */
export type EditorIconName =
  | 'grip'
  | 'plus'
  | 'close'
  | 'upload'
  | 'download'
  | 'busy'
  | 'checked'
  | 'unchecked'
  | 'collapsed'
  | 'expanded'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'paragraph'
  | 'bulleted_list'
  | 'numbered_list'
  | 'to_do'
  | 'toggle'
  | 'code'
  | 'quote'
  | 'divider'
  | 'image'
  | 'file'
  | 'formula'
  | 'table'
  | 'page_link'
  | 'align_left'
  | 'align_center'
  | 'align_right';

/**
 * Переопределение иконок. Кит не тянет иконочную библиотеку — приложение
 * передаёт свой набор (в наших продуктах это lucide-react), иначе рисуются
 * встроенные SVG того же начертания.
 */
export type EditorIcons = Partial<Record<EditorIconName, ReactNode>>;
