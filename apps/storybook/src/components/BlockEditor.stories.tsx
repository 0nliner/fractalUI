import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { vars } from '@fractalui/tokens';
import {
  BlockEditor,
  type CustomBlockDef,
  type EditorBlock,
} from '@fractalui/primitives';

const meta: Meta = { title: 'Components/BlockEditor' };
export default meta;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      width: 640,
      maxWidth: '100%',
      minHeight: 320,
      border: `1px solid ${vars.color.border}`,
      borderRadius: vars.radius.md,
      padding: vars.space.md,
    }}
  >
    {children}
  </div>
);

/** Базовый редактор: «/» открывает меню вставки, drag за ручку переставляет блоки. */
export const Basic: StoryObj = {
  render: function BasicEditor() {
    const [blocks, setBlocks] = useState<EditorBlock[]>([
      { id: 'h', type: 'heading2', content: 'Черновик' },
      { id: 'p', type: 'paragraph', content: 'Нажмите «/» в пустой строке — появится меню блоков.' },
    ]);
    return (
      <Frame>
        <BlockEditor value={blocks} onChange={setBlocks} />
      </Frame>
    );
  },
};

// ── Кастом-блок «Плашка» ────────────────────────────────────────────────────
// Приложение объявляет свой тип блока: рендер + правка + иконка в меню «/» +
// начальные данные. Ядро кита не трогается. Данные живут в `block.data`.

type CalloutTone = 'info' | 'warn' | 'ok';
const TONES: { value: CalloutTone; label: string; bg: string; fg: string }[] = [
  { value: 'info', label: 'Инфо', bg: vars.color.surface, fg: vars.color.fg },
  { value: 'warn', label: 'Внимание', bg: vars.color.surface, fg: vars.color.accent },
  { value: 'ok', label: 'Готово', bg: vars.color.surface, fg: vars.color.accent },
];

/** Прочитать поля кастом-блока из `block.data` с дефолтами. */
function readCallout(block: EditorBlock): { tone: CalloutTone; text: string } {
  const d = (block.data ?? {}) as { tone?: CalloutTone; text?: string };
  return { tone: d.tone ?? 'info', text: d.text ?? '' };
}

const calloutBlock: CustomBlockDef = {
  type: 'callout',
  label: 'Плашка',
  description: 'Инфо / внимание / готово',
  icon: <span aria-hidden>◆</span>,
  defaultData: () => ({ data: { tone: 'info', text: '' } }),
  render: ({ block, onChange, isEditing, readOnly }) => {
    const { tone, text } = readCallout(block);
    const t = TONES.find((x) => x.value === tone) ?? TONES[0];
    const editable = isEditing && !readOnly;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: vars.space.xs,
          padding: vars.space.sm,
          borderRadius: vars.radius.sm,
          background: t.bg,
          borderLeft: `3px solid ${t.fg}`,
        }}
      >
        {editable && (
          <div style={{ display: 'flex', gap: vars.space.xs }}>
            {TONES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ data: { ...block.data, tone: opt.value } })}
                style={{
                  padding: `2px ${vars.space.xs}`,
                  borderRadius: vars.radius.sm,
                  border: `1px solid ${vars.color.border}`,
                  background: opt.value === tone ? vars.color.bg : 'transparent',
                  color: vars.color.fg,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
        {editable ? (
          <input
            value={text}
            placeholder="Текст плашки…"
            onChange={(e) => onChange({ data: { ...block.data, text: e.target.value } })}
            style={{
              border: 'none',
              background: 'transparent',
              color: t.fg,
              font: 'inherit',
              outline: 'none',
            }}
          />
        ) : (
          <span style={{ color: t.fg }}>{text || 'Пустая плашка'}</span>
        )}
      </div>
    );
  },
};

/**
 * Кастом-блок через `customBlocks`. Пункт «Плашка» появляется в меню «/» после
 * встроенных типов; выбранный блок несёт `data = { tone, text }` и рисуется своим
 * `render`. При сохранении лишние поля блока сохраняются losslessly.
 */
export const CustomBlock: StoryObj = {
  render: function EditorWithCustomBlock() {
    const [blocks, setBlocks] = useState<EditorBlock[]>([
      { id: 'h', type: 'heading2', content: 'Кастом-блоки' },
      { id: 'p', type: 'paragraph', content: 'Нажмите «/» и выберите «Плашка».' },
      { id: 'c', type: 'callout', content: '', data: { tone: 'ok', text: 'Это кастом-блок приложения.' } },
    ]);
    return (
      <Frame>
        <BlockEditor value={blocks} onChange={setBlocks} customBlocks={[calloutBlock]} />
      </Frame>
    );
  },
};

// ── Плитки (12-колоночный лейаут) ───────────────────────────────────────────

const WideFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      width: 980,
      maxWidth: '100%',
      minHeight: 360,
      border: `1px solid ${vars.color.border}`,
      borderRadius: vars.radius.md,
      padding: vars.space.md,
    }}
  >
    {children}
  </div>
);

const LAYOUT_BLOCKS: EditorBlock[] = [
  { id: 'title', type: 'heading2', content: 'Дашборд проекта', layout: { colSpan: 12 } },
  {
    id: 'a',
    type: 'paragraph',
    content:
      'Прокручиваемая плитка (scroll:y, rowSpan 2): много текста, который скроллится внутри закреплённой области. ' +
      'Строка раз. Строка два. Строка три. Строка четыре. Строка пять. Строка шесть. Строка семь.',
    layout: { colSpan: 4, rowSpan: 2, scroll: 'y' },
  },
  { id: 'b', type: 'paragraph', content: 'Плитка на 4 колонки.', layout: { colSpan: 4 } },
  { id: 'c', type: 'paragraph', content: 'Залоченная плитка (locked).', layout: { colSpan: 4, locked: true } },
  { id: 'd', type: 'quote', content: 'Широкая плитка на 8 колонок.', layout: { colSpan: 8 } },
  { id: 'e', type: 'paragraph', content: 'И на 4.', layout: { colSpan: 4 } },
];

/**
 * Режим `layout`: блоки — плитки на 12-колоночной сетке. Клик по плитке
 * показывает primary-контур, круглые ручки на центрах граней, тулбар под плиткой
 * (замок «занять область», прокрутка+оси, пресеты ширины, высота ±, дубль/удалить)
 * + направляющие сетки и лёгкие контуры соседей. ПКМ → «Размер плитки».
 * `toolbar` даёт кнопку «На весь экран».
 */
export const Layout: StoryObj = {
  render: function LayoutEditor() {
    const [blocks, setBlocks] = useState<EditorBlock[]>(LAYOUT_BLOCKS);
    return (
      <WideFrame>
        <BlockEditor value={blocks} onChange={setBlocks} layout toolbar />
      </WideFrame>
    );
  },
};

/**
 * Тот же документ в `readOnly layout` — сетка и геометрия рендерятся идентично
 * edit-режиму, но без ручек/меню (паритет вьюера; так рисует публичный сайт).
 */
export const LayoutReadOnly: StoryObj = {
  render: () => (
    <WideFrame>
      <BlockEditor value={LAYOUT_BLOCKS} onChange={() => {}} layout readOnly />
    </WideFrame>
  ),
};
