import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@fractalui/tokens';
import { Grid, Mono, Title, Label } from '../_ui';

const shadows: { name: string; value: string }[] = [
  { name: 'shadow.sm', value: vars.shadow.sm },
  { name: 'shadow.md', value: vars.shadow.md },
];

function Elevation() {
  return (
    <div>
      <Title>Elevation — поверхности держатся на тени, а не на обводке</Title>
      <Grid min="220px">
        {shadows.map((s) => (
          <div
            key={s.name}
            style={{
              background: vars.color.surface,
              borderRadius: vars.radius.lg,
              boxShadow: s.value,
              padding: vars.space.lg,
              minHeight: 96,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <Label>{s.name}</Label>
            <Mono>vars.{s.name}</Mono>
          </div>
        ))}
      </Grid>
    </div>
  );
}

const meta: Meta<typeof Elevation> = { title: 'Foundations/Elevation', component: Elevation };
export default meta;
export const Shadows: StoryObj<typeof Elevation> = {};
