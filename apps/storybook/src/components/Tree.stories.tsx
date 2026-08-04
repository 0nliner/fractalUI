import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { vars } from '@fractalui/tokens';
import { Tree, type TreeFacet, type TreeNode } from '@fractalui/primitives';

// Доменная модель узла (пример). Кит её не знает — фасеты читают из node.data.
type Doc = {
  id: string;
  title: string;
  type: 'article' | 'section' | 'proposal' | 'note';
  tags: string[];
  starred: boolean;
  children?: Doc[];
};

const DOCS: Doc[] = [
  {
    id: 'strategy', title: 'Стратегия', type: 'section', tags: [], starred: false,
    children: [
      { id: 'icp', title: 'ICP и позиционирование', type: 'article', tags: ['icp', 'маркетинг'], starred: true },
      { id: 'okr', title: 'OKR на квартал', type: 'note', tags: ['планирование'], starred: false },
    ],
  },
  {
    id: 'sales', title: 'Продажи', type: 'section', tags: [], starred: false,
    children: [
      { id: 'kp-alpha', title: 'КП «Альфа»', type: 'proposal', tags: ['кп', 'b2b'], starred: false },
      { id: 'kp-beta', title: 'КП «Бета»', type: 'proposal', tags: ['кп'], starred: true },
      { id: 'script', title: 'Скрипт первого звонка', type: 'article', tags: ['продажи'], starred: false },
    ],
  },
  { id: 'onboarding', title: 'Онбординг', type: 'article', tags: ['hr', 'регламент'], starred: false },
  { id: 'nda', title: 'Шаблон NDA', type: 'note', tags: ['юр'], starred: false },
];

const TYPE_LABEL: Record<Doc['type'], string> = {
  article: 'Статья',
  section: 'Раздел',
  proposal: 'КП',
  note: 'Заметка',
};

const toNode = (d: Doc): TreeNode => ({
  id: d.id,
  label: d.title,
  data: d,
  children: d.children?.map(toNode),
  searchText: [d.tags.join(' '), TYPE_LABEL[d.type]].join(' '),
  meta: (
    <span style={{ display: 'inline-flex', gap: vars.space.xs, alignItems: 'center', color: vars.color.muted }}>
      {d.children?.length ? <span>{d.children.length}</span> : null}
      {d.starred ? <span style={{ color: vars.color.accent }}>★</span> : null}
    </span>
  ),
});

const Frame = ({ children, width = 340 }: { children: React.ReactNode; width?: number }) => (
  <div style={{ height: 460, width, border: `1px solid ${vars.color.border}`, borderRadius: vars.radius.md, overflow: 'hidden' }}>
    {children}
  </div>
);

const meta: Meta = { title: 'Components/Tree' };
export default meta;

/** Базовое дерево с поиском. */
export const Basic: StoryObj = {
  render: function BasicTree() {
    const [sel, setSel] = useState<string | null>(null);
    const [exp, setExp] = useState<string[]>(['strategy', 'sales']);
    return (
      <Frame>
        <Tree
          nodes={DOCS.map(toNode)}
          searchable
          selectedId={sel}
          onSelect={(n) => setSel(n.id)}
          expandedIds={exp}
          onExpandedChange={setExp}
        />
      </Frame>
    );
  },
};

/**
 * Фасетный фильтр: иконка справа от поиска раскрывает панель под ним.
 * `toggle` (Избранные), `chips` (тип объекта), `tags` («+ тег» с автоподсказками).
 * Всё — данные через props; кит рисует панель и прунит `nodes` (предки сохраняются).
 */
export const WithFacets: StoryObj = {
  render: function FacetedTree() {
    const [sel, setSel] = useState<string | null>(null);
    const d = (n: TreeNode) => n.data as Doc;
    const facets: TreeFacet[] = [
      { id: 'starred', kind: 'toggle', label: 'Избранные', get: (n) => d(n).starred },
      {
        id: 'type',
        kind: 'chips',
        get: (n) => d(n).type,
        options: (Object.keys(TYPE_LABEL) as Doc['type'][]).map((v) => ({ value: v, label: TYPE_LABEL[v] })),
      },
      { id: 'tags', kind: 'tags', placeholder: '+ тег', get: (n) => d(n).tags },
    ];
    return (
      <Frame>
        <Tree
          nodes={DOCS.map(toNode)}
          searchable
          facets={facets}
          selectedId={sel}
          onSelect={(n) => setSel(n.id)}
          defaultExpandAll
        />
      </Frame>
    );
  },
};
