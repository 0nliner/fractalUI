import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { FractalApp, definePage, type AppConfig } from '@fractalui/runtime';
import type { ObjectSchema } from '@fractalui/patterns';
import { Avatar, Badge } from '@fractalui/primitives';

type Order = { id: string; customer: string; amount: number; status: 'active' | 'draft' | 'overdue' };
type Plan = { id: string; title: string; period: string };

const tone = { active: 'accent', draft: 'muted', overdue: 'danger' } as const;

const orderSchema: ObjectSchema = {
  type: 'object',
  title: 'Новая заявка',
  required: ['customer', 'amount', 'status'],
  properties: {
    customer: { type: 'string', title: 'Клиент' },
    amount: { type: 'integer', title: 'Сумма' },
    status: { type: 'string', title: 'Статус', enum: ['active', 'draft', 'overdue'] },
  },
};

const initialOrders: Order[] = [
  { id: '1024', customer: 'Иван Иванов', amount: 12990, status: 'active' },
  { id: '1025', customer: 'ООО Ромашка', amount: 4500, status: 'draft' },
  { id: '1026', customer: 'Мария П.', amount: 98000, status: 'overdue' },
];

const plans: Plan[] = [
  { id: 'p1', title: 'План А', period: '01.06 – 30.06' },
  { id: 'p2', title: 'План Б', period: '01.07 – 31.07' },
];

/**
 * Пример «как всё связывается»: одно дерево AppConfig → навигация + страницы.
 * Заявки (таблица) с формой создания, Планы (feed). Данные — мок в state;
 * «Добавить заявку» открывает Drawer с AutoForm, сабмит добавляет строку.
 */
function HelloApp() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const config: AppConfig = useMemo(
    () => ({
      brand: { title: 'fractalUI', logo: <Avatar seed="fractalui" size={24} /> },
      pages: [
        definePage<Order>({
          key: 'orders',
          title: 'Заявки',
          icon: '🧾',
          data: orders,
          visualization: {
            type: 'table',
            columns: [
              { key: 'id', header: '#', width: 60 },
              { key: 'customer', header: 'Клиент' },
              { key: 'amount', header: 'Сумма', cell: (r) => `${r.amount.toLocaleString('ru-RU')} ₽` },
              { key: 'status', header: 'Статус', cell: (r) => <Badge tone={tone[r.status]}>{r.status}</Badge> },
            ],
          },
          createAction: {
            label: 'Добавить заявку',
            schema: orderSchema,
            onSubmit: (v) =>
              setOrders((prev) => [
                ...prev,
                {
                  id: String(1024 + prev.length),
                  customer: String(v.customer ?? ''),
                  amount: Number(v.amount ?? 0),
                  status: (v.status as Order['status']) ?? 'draft',
                },
              ]),
          },
        }),
        definePage<Plan>({
          key: 'plans',
          title: 'Планы',
          icon: '📦',
          data: plans,
          visualization: {
            type: 'feed',
            fields: [
              { key: 'title', render: (r) => <strong>{r.title}</strong> },
              { key: 'period', label: 'Период' },
            ],
          },
        }),
      ],
    }),
    [orders],
  );

  return <FractalApp config={config} />;
}

const meta: Meta<typeof HelloApp> = { title: 'Examples/Hello App', component: HelloApp, parameters: { layout: 'fullscreen' } };
export default meta;
export const App: StoryObj<typeof HelloApp> = {};
