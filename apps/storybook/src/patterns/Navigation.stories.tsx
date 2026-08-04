import type { Meta, StoryObj } from '@storybook/react';
import { Navigation } from '@fractalui/patterns';
import { Avatar } from '@fractalui/primitives';

const meta: Meta = { title: 'Patterns/Navigation' };
export default meta;

export const Sidebar: StoryObj = {
  render: () => (
    <div style={{ height: 420 }}>
      <Navigation
        title="fractalUI"
        logo={<Avatar seed="fractalui" size={28} />}
        items={[
          { id: 'dashboard', label: 'Дашборд', icon: '▦', active: true },
          { id: 'orders', label: 'Заявки', icon: '🧾' },
          { id: 'vendors', label: 'Вендоры', icon: '🏭' },
          { id: 'settings', label: 'Настройки', icon: '⚙' },
        ]}
        footer={<span style={{ fontSize: 11, opacity: 0.6 }}>v0 · 2026</span>}
      />
    </div>
  ),
};
