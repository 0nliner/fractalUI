import { memo } from 'react';
import { useEditorConfig } from '../context';
import { EditableText } from './EditableText';
import * as s from '../BlockEditor.css';
import type { BlockViewProps } from '../types';

export const ParagraphBlock = memo(function ParagraphBlock(p: BlockViewProps) {
  return (
    <EditableText
      value={p.block.content}
      onChange={(content) => p.onUpdate({ content })}
      onKeyDown={p.onKeyDown}
      isEditing={p.isEditing}
      readOnly={p.readOnly}
      onFocus={p.onFocus}
      onBlur={p.onBlur}
      multiline
      placeholder="Текст, «/» — список команд"
    />
  );
});

export const HeadingBlock = memo(function HeadingBlock({
  level,
  ...p
}: BlockViewProps & { level: 1 | 2 | 3 }) {
  return (
    <EditableText
      value={p.block.content}
      onChange={(content) => p.onUpdate({ content })}
      onKeyDown={p.onKeyDown}
      isEditing={p.isEditing}
      readOnly={p.readOnly}
      onFocus={p.onFocus}
      onBlur={p.onBlur}
      className={s.heading[level]}
      placeholder={`Заголовок ${level}`}
    />
  );
});

export const QuoteBlock = memo(function QuoteBlock(p: BlockViewProps) {
  return (
    <div className={s.quote}>
      <EditableText
        value={p.block.content}
        onChange={(content) => p.onUpdate({ content })}
        onKeyDown={p.onKeyDown}
        isEditing={p.isEditing}
        readOnly={p.readOnly}
        onFocus={p.onFocus}
        onBlur={p.onBlur}
        multiline
        placeholder="Цитата"
      />
    </div>
  );
});

export const ListBlock = memo(function ListBlock({
  ordered,
  ordinal,
  ...p
}: BlockViewProps & { ordered: boolean; ordinal?: number }) {
  return (
    <div className={s.inlineRow}>
      <span className={s.marker}>{ordered ? `${ordinal ?? 1}.` : '•'}</span>
      <EditableText
        value={p.block.content}
        onChange={(content) => p.onUpdate({ content })}
        onKeyDown={p.onKeyDown}
        isEditing={p.isEditing}
        readOnly={p.readOnly}
        onFocus={p.onFocus}
        onBlur={p.onBlur}
        placeholder="Пункт списка"
        className={s.grow}
      />
    </div>
  );
});

export const TodoBlock = memo(function TodoBlock(p: BlockViewProps) {
  const { icons } = useEditorConfig();
  const checked = !!p.block.checked;
  return (
    <div className={s.inlineRow}>
      <button
        type="button"
        className={s.iconButton}
        data-checked={checked ? 'true' : undefined}
        title={checked ? 'Снять отметку' : 'Отметить выполненным'}
        aria-label={checked ? 'Снять отметку' : 'Отметить выполненным'}
        aria-pressed={checked}
        disabled={p.readOnly}
        onClick={(e) => {
          e.stopPropagation();
          p.onUpdate({ checked: !checked });
        }}
      >
        {checked ? icons.checked : icons.unchecked}
      </button>
      <EditableText
        value={p.block.content}
        onChange={(content) => p.onUpdate({ content })}
        onKeyDown={p.onKeyDown}
        isEditing={p.isEditing}
        readOnly={p.readOnly}
        onFocus={p.onFocus}
        onBlur={p.onBlur}
        placeholder="Задача"
        className={checked ? `${s.grow} ${s.struck}` : s.grow}
      />
    </div>
  );
});

export const ToggleBlock = memo(function ToggleBlock(p: BlockViewProps) {
  const { icons } = useEditorConfig();
  // Состояние живёт только в блоке: локальная копия рассинхронизируется с
  // внешними правками (агент, отмена действия).
  const collapsed = !!p.block.collapsed;
  const children = p.block.children ?? [];
  return (
    <div>
      <div className={s.inlineRow}>
        <button
          type="button"
          className={s.iconButton}
          title={collapsed ? 'Развернуть' : 'Свернуть'}
          aria-label={collapsed ? 'Развернуть' : 'Свернуть'}
          aria-expanded={!collapsed}
          onClick={(e) => {
            e.stopPropagation();
            p.onUpdate({ collapsed: !collapsed });
          }}
        >
          {collapsed ? icons.collapsed : icons.expanded}
        </button>
        <EditableText
          value={p.block.content}
          onChange={(content) => p.onUpdate({ content })}
          onKeyDown={p.onKeyDown}
          isEditing={p.isEditing}
          readOnly={p.readOnly}
          onFocus={p.onFocus}
          onBlur={p.onBlur}
          placeholder="Заголовок блока"
          className={s.grow}
        />
      </div>
      {!collapsed && children.length > 0 && (
        <div className={s.toggleChildren}>
          {children.map((child) => (
            <div key={child.id}>{child.content}</div>
          ))}
        </div>
      )}
    </div>
  );
});

export const DividerBlock = memo(function DividerBlock() {
  return <div className={s.divider} role="separator" />;
});

export const FormulaBlock = memo(function FormulaBlock(p: BlockViewProps) {
  const { renderFormula } = useEditorConfig();
  if (p.isEditing && !p.readOnly) {
    return (
      <EditableText
        value={p.block.content}
        onChange={(content) => p.onUpdate({ content })}
        onKeyDown={p.onKeyDown}
        isEditing
        onFocus={p.onFocus}
        onBlur={p.onBlur}
        multiline
        className={s.formulaRaw}
        placeholder="LaTeX-формула, например E = mc^2"
      />
    );
  }
  if (!p.block.content) return <div className={s.hint}>Формула</div>;
  return (
    <div className={s.formulaBox}>
      {/* Без renderFormula блок не предлагается в меню, но старое содержимое
          всё равно надо показать — хотя бы исходником. */}
      {renderFormula ? renderFormula(p.block.content) : <code className={s.formulaRaw}>{p.block.content}</code>}
    </div>
  );
});
