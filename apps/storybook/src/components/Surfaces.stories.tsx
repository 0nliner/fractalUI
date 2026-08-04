import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@fractalui/tokens';
import { Card, Badge, Button, Avatar, TextField } from '@fractalui/primitives';

const meta: Meta = { title: 'Components/Surfaces' };
export default meta;

export const Badges: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: vars.space.sm, flexWrap: 'wrap' }}>
      <Badge tone="accent">active</Badge>
      <Badge tone="muted">draft</Badge>
      <Badge tone="danger">overdue</Badge>
      <Badge tone="brand">pro</Badge>
    </div>
  ),
};

export const Cards: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: vars.space.lg, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', maxWidth: 920 }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: vars.space.sm }}>
            <Avatar seed="user-1024" label="ИИ" />
            <strong>Заявка #1024</strong>
          </div>
          <Badge tone="brand">new</Badge>
        </div>
        <span style={{ color: vars.color.muted, fontSize: vars.font.sizeSm }}>Создана 20.06.2026</span>
        <div style={{ display: 'flex', gap: vars.space.sm, marginTop: vars.space.sm }}>
          <Button size="sm">Принять</Button>
          <Button size="sm" variant="secondary">Отложить</Button>
          <Button size="sm" variant="ghost">Детали</Button>
        </div>
      </Card>

      <Card>
        <strong>Новый контакт</strong>
        <TextField label="Имя" placeholder="Иван Иванов" />
        <TextField label="Email" placeholder="ivan@example.com" />
        <div style={{ display: 'flex', gap: vars.space.sm, marginTop: vars.space.sm }}>
          <Button>Сохранить</Button>
          <Button variant="ghost">Отмена</Button>
        </div>
      </Card>
    </div>
  ),
};
