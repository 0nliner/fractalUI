import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@fractalui/tokens';
import { LavaLamp, Avatar, Card, Button, Badge } from '@fractalui/primitives';
import { Title, Mono } from '../_ui';

const meta: Meta = { title: 'Identity/Overview' };
export default meta;

export const BrandGradient: StoryObj = {
  render: () => (
    <div>
      <Title>Фирменный градиент</Title>
      <div
        style={{
          height: 160,
          borderRadius: vars.radius.lg,
          background: vars.gradient.brand,
          display: 'flex',
          alignItems: 'flex-end',
          padding: vars.space.lg,
          color: '#0b1512',
          fontWeight: vars.font.weightBold,
        }}
      >
        fractalUI · orange → green
      </div>
      <div style={{ marginTop: vars.space.sm }}>
        <Mono>vars.gradient.brand</Mono>
      </div>
    </div>
  ),
};

export const Avatars: StoryObj = {
  render: () => (
    <div>
      <Title>Градиентные аватары (детерминированы из seed)</Title>
      <div style={{ display: 'flex', gap: vars.space.md, alignItems: 'center', flexWrap: 'wrap' }}>
        {['user-1', 'user-1024', 'a3f9c1', 'maria', 'kirill', 'b00b5'].map((seed) => (
          <div key={seed} style={{ textAlign: 'center' }}>
            <Avatar seed={seed} size={56} />
            <div style={{ marginTop: vars.space.xs }}>
              <Mono>{seed}</Mono>
            </div>
          </div>
        ))}
        <div style={{ textAlign: 'center' }}>
          <Avatar size={56} label="✦" />
          <div style={{ marginTop: vars.space.xs }}>
            <Mono>без seed → бренд</Mono>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const LavaLampBg: StoryObj = {
  render: () => (
    <div>
      <Title>Лава-лампа (фирменный фон)</Title>
      <div style={{ position: 'relative', height: 320, borderRadius: vars.radius.lg, overflow: 'hidden', background: vars.color.bg }}>
        <LavaLamp count={7} />
      </div>
    </div>
  ),
};

export const Hero: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', minHeight: 420, borderRadius: vars.radius.lg, overflow: 'hidden', background: vars.color.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: vars.space.xl }}>
      <LavaLamp count={6} opacity={0.5} />
      <Card style={{ position: 'relative', zIndex: 1, maxWidth: 420, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: vars.space.sm }}>
          <Avatar seed="fractalui" size={40} />
          <strong style={{ fontSize: vars.font.sizeLg }}>fractalUI</strong>
          <Badge tone="brand">v0</Badge>
        </div>
        <span style={{ color: vars.color.muted }}>
          Слоистый headless UI-кит + конфиг-движок. Тёмная айдентика, тил-акцент и
          фирменный градиент — на дизайн-токенах.
        </span>
        <div style={{ display: 'flex', gap: vars.space.sm, marginTop: vars.space.sm }}>
          <Button variant="brand">Начать</Button>
          <Button variant="secondary">Документация</Button>
        </div>
      </Card>
    </div>
  ),
};
