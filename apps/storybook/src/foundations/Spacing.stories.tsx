import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@fractalui/tokens';
import { Label, Mono, Title } from '../_ui';

const spaces: { name: string; value: string }[] = [
  { name: 'xs', value: vars.space.xs },
  { name: 'sm', value: vars.space.sm },
  { name: 'md', value: vars.space.md },
  { name: 'lg', value: vars.space.lg },
  { name: 'xl', value: vars.space.xl },
];

function Spacing() {
  return (
    <div>
      <Title>Spacing</Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space.md }}>
        {spaces.map((s) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: vars.space.md }}>
            <div style={{ width: 64 }}>
              <Label>{s.name}</Label>
            </div>
            <div style={{ height: 16, width: s.value, background: vars.color.accent, borderRadius: vars.radius.sm }} />
            <Mono>vars.space.{s.name}</Mono>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof Spacing> = { title: 'Foundations/Spacing', component: Spacing };
export default meta;
export const Scale: StoryObj<typeof Spacing> = {};
