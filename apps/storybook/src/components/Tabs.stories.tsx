import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '@fractalui/primitives';

const meta: Meta = { title: 'Components/Tabs' };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Tabs
        defaultSelectedKey="overview"
        items={[
          { id: 'overview', label: 'Обзор', content: 'Сводка по сущности.' },
          { id: 'details', label: 'Детали', content: 'Подробные поля и значения.' },
          { id: 'history', label: 'История', content: 'Журнал изменений.' },
        ]}
      />
    </div>
  ),
};
