import type { Meta, StoryObj } from '@storybook/react';
import { Feed, type FeedField } from '@fractalui/patterns';
import { Badge, Button } from '@fractalui/primitives';

type Plan = { id: string; title: string; period: string; status: 'active' | 'draft' | 'overdue' };

const data: Plan[] = [
  { id: 'p1', title: 'План питания №1', period: '01.06 – 30.06', status: 'active' },
  { id: 'p2', title: 'План питания №2', period: '01.07 – 31.07', status: 'draft' },
  { id: 'p3', title: 'План питания №3', period: '01.05 – 31.05', status: 'overdue' },
];

const tone = { active: 'accent', draft: 'muted', overdue: 'danger' } as const;

const fields: FeedField<Plan>[] = [
  { key: 'title', render: (r) => <strong>{r.title}</strong> },
  { key: 'period', label: 'Период' },
  { key: 'status', label: 'Статус', render: (r) => <Badge tone={tone[r.status]}>{r.status}</Badge> },
];

const meta: Meta = { title: 'Patterns/Feed' };
export default meta;

export const Cards: StoryObj = {
  render: () => (
    <Feed<Plan>
      items={data}
      fields={fields}
      getItemId={(r) => r.id}
      renderActions={(r) => (
        <>
          <Button size="sm" variant="ghost">
            Открыть
          </Button>
          <Button size="sm" variant="ghost">
            Удалить {r.id}
          </Button>
        </>
      )}
    />
  ),
};
