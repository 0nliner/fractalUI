import type { Meta, StoryObj } from '@storybook/react';
import { bp, vars } from '@fractalui/tokens';
import { Grid, Label, Mono, Tile, Title } from '../_ui';

/**
 * Токены, добавленные при переходе кита с плотных админок на витрины.
 * Одна стори на все новые группы: они проверяются вместе и глазом, и в обеих темах.
 */

const semantic = [
  { name: 'success', bg: vars.color.success, fg: vars.color.successFg },
  { name: 'warning', bg: vars.color.warning, fg: vars.color.warningFg },
  { name: 'info', bg: vars.color.info, fg: vars.color.infoFg },
  { name: 'danger', bg: vars.color.danger, fg: vars.color.accentFg },
];

const states = [
  { name: 'accent', value: vars.color.accent },
  { name: 'accentHover', value: vars.color.accentHover },
  { name: 'accentActive', value: vars.color.accentActive },
  { name: 'surface', value: vars.color.surface },
  { name: 'surfaceHover', value: vars.color.surfaceHover },
  { name: 'surfaceSunken', value: vars.color.surfaceSunken },
];

const typeScale = [
  { name: 'sizeSm', size: vars.font.sizeSm },
  { name: 'sizeMd', size: vars.font.sizeMd },
  { name: 'sizeLg', size: vars.font.sizeLg },
  { name: 'sizeXl', size: vars.font.sizeXl },
  { name: 'sizeXl2', size: vars.font.sizeXl2 },
  { name: 'sizeXl3', size: vars.font.sizeXl3 },
  { name: 'sizeXl4', size: vars.font.sizeXl4 },
];

const controls = [
  { name: 'controlSm', h: vars.size.controlSm },
  { name: 'control', h: vars.size.control },
  { name: 'controlLg', h: vars.size.controlLg },
  { name: 'tapTarget', h: vars.size.tapTarget },
];

const elevation = [
  { name: 'sm', value: vars.shadow.sm },
  { name: 'md', value: vars.shadow.md },
  { name: 'lg', value: vars.shadow.lg },
  { name: 'xl', value: vars.shadow.xl },
  { name: 'focus', value: vars.shadow.focus },
];

function TokensV2() {
  return (
    <div style={{ display: 'grid', gap: vars.space.xl3 }}>
      <section>
        <Title>Семантика статусов</Title>
        <Grid>
          {semantic.map((s) => (
            <Tile key={s.name} style={{ padding: 0, overflow: 'hidden' }}>
              <div
                style={{
                  height: 72,
                  background: s.bg,
                  color: s.fg,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: vars.font.weightBold,
                }}
              >
                {s.name}
              </div>
              <div style={{ padding: vars.space.md }}>
                <Mono>vars.color.{s.name}</Mono>
              </div>
            </Tile>
          ))}
        </Grid>
      </section>

      <section>
        <Title>Состояния взаимодействия</Title>
        <p style={{ color: vars.color.muted, fontSize: vars.font.sizeSm, marginTop: 0 }}>
          В брендовых темах выводятся из accent/surface через color-mix и подстраиваются
          под палитру продукта. Здесь видно, что hover и active различимы, а не «почти тот же цвет».
        </p>
        <Grid>
          {states.map((s) => (
            <Tile key={s.name} style={{ padding: 0, overflow: 'hidden' }}>
              <div
                style={{
                  height: 56,
                  background: s.value,
                  borderBottom: `1px solid ${vars.color.border}`,
                }}
              />
              <div style={{ padding: vars.space.md }}>
                <Label>{s.name}</Label>
              </div>
            </Tile>
          ))}
        </Grid>
      </section>

      <section>
        <Title>Шкала заголовков</Title>
        <div style={{ display: 'grid', gap: vars.space.md }}>
          {typeScale.map((t) => (
            <div key={t.name} style={{ display: 'flex', alignItems: 'baseline', gap: vars.space.lg }}>
              <span style={{ minWidth: 88 }}>
                <Mono>{t.name}</Mono>
              </span>
              <span style={{ fontSize: t.size, lineHeight: vars.font.lineTight }}>
                Мастер-классы и рукоделие
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Title>Размеры контролов</Title>
        <p style={{ color: vars.color.muted, fontSize: vars.font.sizeSm, marginTop: 0 }}>
          tapTarget — минимум для пальца (44px) и от плотности не зависит.
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: vars.space.md }}>
          {controls.map((c) => (
            <div key={c.name} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 96,
                  height: c.h,
                  background: vars.color.accent,
                  color: vars.color.accentFg,
                  borderRadius: vars.radius.md,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: vars.font.sizeSm,
                }}
              >
                {c.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Title>Тени</Title>
        <Grid>
          {elevation.map((e) => (
            <Tile key={e.name} style={{ boxShadow: e.value }}>
              <Label>shadow.{e.name}</Label>
            </Tile>
          ))}
        </Grid>
      </section>

      <section>
        <Title>Брейкпоинты</Title>
        <p style={{ color: vars.color.muted, fontSize: vars.font.sizeSm, marginTop: 0 }}>
          Не токены и не могут ими быть: медиа-условие не читает CSS-переменную.
          Обычный TS из <code>@fractalui/tokens</code>, mobile-first, только min-width.
        </p>
        <div style={{ display: 'grid', gap: vars.space.sm }}>
          {(Object.keys(bp) as (keyof typeof bp)[]).map((key) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: vars.space.md }}>
              <span style={{ minWidth: 48 }}>
                <Mono>{key}</Mono>
              </span>
              <div
                style={{
                  height: 10,
                  width: `${bp[key] / 12}px`,
                  background: vars.gradient.brand,
                  borderRadius: vars.radius.full,
                }}
              />
              <span style={{ color: vars.color.fgSubtle, fontSize: vars.font.sizeSm }}>
                {bp[key]}px
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const meta: Meta<typeof TokensV2> = { title: 'Foundations/Tokens v2', component: TokensV2 };
export default meta;
export const Overview: StoryObj<typeof TokensV2> = {};
