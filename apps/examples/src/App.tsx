import { useMemo, useState } from 'react';
import { lightTheme, darkTheme, vars } from '@fractalui/tokens';
import { FractalApp, definePage, type AppConfig } from '@fractalui/runtime';
import type { ObjectSchema } from '@fractalui/patterns';
import { Avatar, Badge, Switch } from '@fractalui/primitives';

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

export function App() {
  const [dark, setDark] = useState(true);
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

  return (
    <div
      className={dark ? darkTheme : lightTheme}
      style={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        background: vars.color.bg,
        color: vars.color.fg,
        fontFamily: vars.font.family,
        fontSize: vars.font.sizeMd,
        padding: vars.space.lg,
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: vars.space.lg }}>
        <strong style={{ fontSize: vars.font.sizeLg }}>fractalUI — demo</strong>
        <Switch isSelected={dark} onChange={setDark}>
          Тёмная тема
        </Switch>
      </header>
      <FractalApp config={config} />
    </div>
  );
}
