import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@fractalui/tokens';
import { Notification } from '@fractalui/primitives';

const meta: Meta = { title: 'Components/Notification' };
export default meta;

export const Statuses: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space.md, maxWidth: 320 }}>
      <Notification status="info" title="Инфо" onClose={() => {}}>
        Синхронизация запущена.
      </Notification>
      <Notification status="success" title="Готово" onClose={() => {}}>
        Заявка создана.
      </Notification>
      <Notification status="error" title="Ошибка" onClose={() => {}}>
        Не удалось сохранить.
      </Notification>
    </div>
  ),
};
