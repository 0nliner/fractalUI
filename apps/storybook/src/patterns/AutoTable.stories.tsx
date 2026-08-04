import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { vars } from '@fractalui/tokens';
import { Badge, Avatar } from '@fractalui/primitives';
import { AutoTable, type AutoColumn } from '@fractalui/patterns';

type Order = {
  id: string;
  customer: string;
  amount: number;
  status: 'active' | 'draft' | 'overdue';
  date: string;
};

const data: Order[] = [
  { id: '1024', customer: 'Иван Иванов', amount: 12990, status: 'active', date: '2026-06-20' },
  { id: '1025', customer: 'ООО Ромашка', amount: 4500, status: 'draft', date: '2026-06-19' },
  { id: '1026', customer: 'Мария П.', amount: 98000, status: 'overdue', date: '2026-06-12' },
  { id: '1027', customer: 'Кирилл С.', amount: 230, status: 'active', date: '2026-06-21' },
];

const statusTone = { active: 'accent', draft: 'muted', overdue: 'danger' } as const;

const columns: AutoColumn<Order>[] = [
  { key: 'id', header: '#', width: 64 },
  {
    key: 'customer',
    header: 'Клиент',
    cell: (r) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <Avatar seed={r.id} size={24} />
        {r.customer}
      </span>
    ),
  },
  { key: 'amount', header: 'Сумма', cell: (r) => `${r.amount.toLocaleString('ru-RU')} ₽` },
  { key: 'status', header: 'Статус', cell: (r) => <Badge tone={statusTone[r.status]}>{r.status}</Badge> },
  { key: 'date', header: 'Дата' },
];

const meta: Meta = { title: 'Patterns/AutoTable' };
export default meta;

export const Basic: StoryObj = {
  render: () => <AutoTable<Order> columns={columns} data={data} getRowId={(r) => r.id} />,
};

export const WithSelection: StoryObj = {
  render: function SelectableTable() {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space.md }}>
        <AutoTable<Order>
          columns={columns}
          data={data}
          getRowId={(r) => r.id}
          enableSelection
          onSelectionChange={setSelected}
        />
        <span style={{ color: vars.color.muted, fontSize: vars.font.sizeSm }}>
          Выбрано: {selected.length ? selected.join(', ') : '—'} · клик по заголовку = сортировка
        </span>
      </div>
    );
  },
};

export const Empty: StoryObj = {
  render: () => <AutoTable<Order> columns={columns} data={[]} emptyMessage="Заявок пока нет" />,
};
