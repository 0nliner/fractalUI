import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@fractalui/tokens';
import { Mono, Title } from '../_ui';

const sizes: { name: string; value: string }[] = [
  { name: 'sizeLg', value: vars.font.sizeLg },
  { name: 'sizeMd', value: vars.font.sizeMd },
  { name: 'sizeSm', value: vars.font.sizeSm },
];

function Typography() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space.lg }}>
      <Title>Typography</Title>
      <div>
        <Mono>vars.font.family</Mono>
        <div style={{ fontFamily: vars.font.family, fontSize: vars.font.sizeLg, marginTop: vars.space.xs }}>
          The quick brown fox jumps over the lazy dog — Съешь же ещё этих булочек
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space.md }}>
        {sizes.map((s) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'baseline', gap: vars.space.md }}>
            <span style={{ fontFamily: vars.font.family, fontSize: s.value }}>fractalUI</span>
            <Mono>vars.font.{s.name}</Mono>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: vars.space.lg }}>
        <span style={{ fontFamily: vars.font.family, fontWeight: vars.font.weightRegular }}>weightRegular</span>
        <span style={{ fontFamily: vars.font.family, fontWeight: vars.font.weightBold }}>weightBold</span>
      </div>
    </div>
  );
}

const meta: Meta<typeof Typography> = { title: 'Foundations/Typography', component: Typography };
export default meta;
export const Type: StoryObj<typeof Typography> = {};
