import { memo, useState } from 'react';
import { useEditorConfig } from '../context';
import { LanguageMenu } from '../menus';
import { EditableText } from './EditableText';
import * as s from '../BlockEditor.css';
import type { BlockViewProps } from '../types';

export const CodeBlock = memo(function CodeBlock(p: BlockViewProps) {
  const { renderCode, languages } = useEditorConfig();
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const language = p.block.language || 'plaintext';
  const label = languages.find((l) => l.id === language)?.label ?? language;

  return (
    <div className={s.codeBox}>
      <div className={s.codeLang}>
        {p.readOnly ? (
          <span>{label}</span>
        ) : (
          <button
            type="button"
            className={s.ghostButton}
            title="Изменить язык блока кода"
            onClick={(e) => {
              e.stopPropagation();
              const r = e.currentTarget.getBoundingClientRect();
              setMenu({ x: r.left, y: r.bottom + 2 });
            }}
          >
            {label}
          </button>
        )}
      </div>

      {p.isEditing && !p.readOnly ? (
        <EditableText
          value={p.block.content}
          onChange={(content) => p.onUpdate({ content })}
          onKeyDown={p.onKeyDown}
          isEditing
          onFocus={p.onFocus}
          onBlur={p.onBlur}
          multiline
          placeholder="Код"
          ariaLabel={`Код на ${label}`}
        />
      ) : p.block.content ? (
        // Подсветку синтаксиса даёт приложение: тащить в кит highlight.js
        // ради одного блока нельзя.
        renderCode ? (
          renderCode(p.block.content, language)
        ) : (
          <pre className={s.pre}>
            <code>{p.block.content}</code>
          </pre>
        )
      ) : (
        <div className={s.hint}>Код</div>
      )}

      {menu && (
        <LanguageMenu
          x={menu.x}
          y={menu.y}
          current={language}
          onSelect={(lang) => {
            p.onUpdate({ language: lang });
            setMenu(null);
          }}
          onClose={() => setMenu(null)}
        />
      )}
    </div>
  );
});
