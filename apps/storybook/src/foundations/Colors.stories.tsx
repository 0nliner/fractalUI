import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@fractalui/tokens';
import { Grid, Tile, Label, Mono, Title } from '../_ui';

const swatches: { name: string; value: string; varName: string }[] = [
  { name: 'bg', value: vars.color.bg, varName: 'color.bg' },
  { name: 'surface', value: vars.color.surface, varName: 'color.surface' },
  { name: 'fg', value: vars.color.fg, varName: 'color.fg' },
  { name: 'muted', value: vars.color.muted, varName: 'color.muted' },
  { name: 'accent', value: vars.color.accent, varName: 'color.accent' },
  { name: 'accentFg', value: vars.color.accentFg, varName: 'color.accentFg' },
  { name: 'border', value: vars.color.border, varName: 'color.border' },
  { name: 'danger', value: vars.color.danger, varName: 'color.danger' },
];

function Colors() {
  return (
    <div>
      <Title>Colors — переключи тему в тулбаре (Dark / Light)</Title>
      <Tile style={{ padding: 0, overflow: 'hidden', marginBottom: vars.space.lg }}>
        <div style={{ height: 88, background: vars.gradient.brand }} />
        <div style={{ padding: vars.space.md }}>
          <Label>brand gradient</Label>
          <Mono>vars.gradient.brand</Mono>
        </div>
      </Tile>
      <Grid>
        {swatches.map((s) => (
          <Tile key={s.name} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: 72, background: s.value, borderBottom: `1px solid ${vars.color.border}` }} />
            <div style={{ padding: vars.space.md }}>
              <Label>{s.name}</Label>
              <Mono>vars.{s.varName}</Mono>
            </div>
          </Tile>
        ))}
      </Grid>
    </div>
  );
}

const meta: Meta<typeof Colors> = { title: 'Foundations/Colors', component: Colors };
export default meta;
export const Palette: StoryObj<typeof Colors> = {};
