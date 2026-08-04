import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@fractalui/tokens';
import { Grid, Tile, Label, Mono, Title } from '../_ui';

const radii: { name: string; value: string }[] = [
  { name: 'sm', value: vars.radius.sm },
  { name: 'md', value: vars.radius.md },
  { name: 'lg', value: vars.radius.lg },
  { name: 'full', value: vars.radius.full },
];

function Radius() {
  return (
    <div>
      <Title>Radius</Title>
      <Grid min="160px">
        {radii.map((r) => (
          <Tile key={r.name}>
            <div
              style={{
                height: 72,
                background: vars.color.accent,
                borderRadius: r.value,
                marginBottom: vars.space.md,
              }}
            />
            <Label>{r.name}</Label>
            <Mono>vars.radius.{r.name}</Mono>
          </Tile>
        ))}
      </Grid>
    </div>
  );
}

const meta: Meta<typeof Radius> = { title: 'Foundations/Radius', component: Radius };
export default meta;
export const Scale: StoryObj<typeof Radius> = {};
