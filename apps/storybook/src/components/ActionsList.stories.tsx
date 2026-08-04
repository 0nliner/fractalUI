import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@fractalui/tokens';
import { ActionsList, type ActionItem } from '@fractalui/primitives';

const items: ActionItem[] = [
  { id: 'reports', label: 'Отчёты', icon: '📊', active: true },
  { id: 'students', label: 'Ученики', icon: '🎓' },
  { id: 'journal', label: 'Журнал', icon: '📓' },
  { id: 'dist', label: 'Раздача', icon: '🛒' },
  { id: 'logout', label: 'Выход', icon: '⎋', isDisabled: true },
];

const meta: Meta = { title: 'Components/ActionsList' };
export default meta;

export const Vertical: StoryObj = {
  render: () => (
    <div style={{ width: 220 }}>
      <ActionsList items={items} />
    </div>
  ),
};

export const Horizontal: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: vars.space.md }}>
      <ActionsList items={items.slice(0, 4)} orientation="horizontal" />
    </div>
  ),
};
