import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { vars } from '@fractalui/tokens';
import { Card } from '@fractalui/primitives';
import { AutoForm, type ObjectSchema, type AutoFormValues } from '@fractalui/patterns';

const schema: ObjectSchema = {
  type: 'object',
  title: 'Новый контакт',
  required: ['name', 'email', 'role'],
  properties: {
    name: { type: 'string', title: 'Имя' },
    email: { type: 'string', title: 'Email', description: 'Корпоративная почта' },
    age: { type: 'integer', title: 'Возраст' },
    role: { type: 'string', title: 'Роль', enum: ['admin', 'manager', 'viewer'] },
    subscribed: { type: 'boolean', title: 'Подписка на рассылку' },
  },
};

const meta: Meta = { title: 'Patterns/AutoForm' };
export default meta;

export const FromSchema: StoryObj = {
  render: function AutoFormStory() {
    const [submitted, setSubmitted] = useState<AutoFormValues | null>(null);
    return (
      <div style={{ display: 'flex', gap: vars.space.xl, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <AutoForm schema={schema} onSubmit={setSubmitted} submitLabel="Создать" />
        <Card style={{ minWidth: 260 }}>
          <strong>onSubmit payload</strong>
          <pre style={{ margin: 0, fontSize: vars.font.sizeSm, color: vars.color.muted, whiteSpace: 'pre-wrap' }}>
            {submitted ? JSON.stringify(submitted, null, 2) : 'Заполни форму и нажми «Создать».\nПустые required-поля подсветят ошибку (AJV).'}
          </pre>
        </Card>
      </div>
    );
  },
};
