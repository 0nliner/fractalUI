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

/** Схема товара: все виджеты, которых в v1 не было. */
const productSchema: ObjectSchema = {
  type: 'object',
  title: 'Товар',
  required: ['title', 'price'],
  properties: {
    title: { type: 'string', title: 'Название', placeholder: 'Кружка ручной работы' },
    description: {
      type: 'string',
      title: 'Описание',
      'x-widget': 'textarea',
      placeholder: 'Материалы, процесс, уход…',
    },
    price: { type: 'number', title: 'Цена, ₽', minimum: 0 },
    stock: { type: 'integer', title: 'Остаток', minimum: 0, maximum: 999 },
    category: {
      type: 'string',
      title: 'Категория',
      enum: ['ceramics', 'wood', 'textile'],
      enumLabels: { ceramics: 'Керамика', wood: 'Дерево', textile: 'Текстиль' },
    },
    condition: {
      type: 'string',
      title: 'Состояние',
      enum: ['new', 'preorder'],
      enumLabels: { new: 'В наличии', preorder: 'Под заказ' },
      'x-widget': 'radio',
    },
    availableFrom: { type: 'string', title: 'Доступен с', 'x-widget': 'date' },
    tags: { type: 'array', title: 'Теги', items: { type: 'string' }, placeholder: 'через запятую' },
    photos: { type: 'array', title: 'Фотографии', 'x-widget': 'file', 'x-accept': ['image/*'] },
    isPublished: { type: 'boolean', title: 'Опубликован' },
  },
};

/**
 * Ошибки, пришедшие от сервера, подсвечивают конкретные поля.
 *
 * Так выглядит ответ FastAPI после разбора: `normalizeApiError` собирает карту
 * «поле → сообщение» из массива `detail`, и она отдаётся форме как есть.
 */
export const WithServerErrors: StoryObj = {
  render: function ServerErrorsStory() {
    const [errors, setErrors] = useState<Record<string, string> | undefined>();
    const [formError, setFormError] = useState<string | null>(null);

    return (
      <div style={{ display: 'flex', gap: vars.space.xl, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <AutoForm
          schema={productSchema}
          submitLabel="Сохранить"
          serverErrors={errors}
          formError={formError}
          onSubmit={() => {
            // Имитация 422 от сервера.
            setErrors({ title: 'Товар с таким названием уже есть', price: 'Цена ниже себестоимости' });
            setFormError('Не удалось сохранить товар');
          }}
        />
        <Card style={{ minWidth: 260 }}>
          <strong>Что проверяем</strong>
          <p style={{ margin: 0, fontSize: vars.font.sizeSm, color: vars.color.muted }}>
            Отправьте форму — сервер «вернёт» ошибки по полям title и price.
            Они подсветят именно эти поля, а не общий текст под кнопкой.
          </p>
        </Card>
      </div>
    );
  },
};
