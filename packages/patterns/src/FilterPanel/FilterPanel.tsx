import { useState } from 'react';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Drawer,
  Slider,
  Stack,
} from '@fractalui/primitives';
import * as s from './FilterPanel.css';

/** Значение одного варианта фасета. `count` — сколько товаров под него попадает. */
export type FacetValue = {
  value: string;
  label?: string;
  count?: number;
};

export type Facet =
  | { kind: 'checkbox'; key: string; title: string; values: FacetValue[] }
  | { kind: 'range'; key: string; title: string; min: number; max: number; step?: number; formatValue?: (v: number | number[]) => string };

/** Выбранное: списки значений для чекбоксов, пара чисел для диапазона. */
export type FilterValue = Record<string, string[] | [number, number] | undefined>;

export type FilterPanelProps = {
  facets: Facet[];
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  /** Сколько всего найдено — показывается на кнопке применения на мобиле. */
  resultCount?: number;
};

function labelOf(facet: Facet, raw: string) {
  if (facet.kind !== 'checkbox') return raw;
  return facet.values.find((v) => v.value === raw)?.label ?? raw;
}

/**
 * Панель фасетных фильтров.
 *
 * Форма входа повторяет то, что уже отдаёт бэкенд CraftSphere
 * (`GET /api/catalog/facets`), — ни маппера, ни адаптера между ними не нужно.
 * Своего состояния у панели нет: значение приходит и уходит через props, чтобы
 * страница могла держать его в URL и переживать перезагрузку.
 *
 * Ниже `md` панель уезжает в `Drawer` по кнопке «Фильтры (N)»: на телефоне
 * колонка фильтров съедает экран, ради которого пришли.
 */
export function FilterPanel({ facets, value, onChange, resultCount }: FilterPanelProps) {
  const [isOpen, setOpen] = useState(false);

  // Тип задан явно: у веток flatMap разные формы (`raw: string` против
  // `raw: null`), и вывести общий тип сам TS не берётся.
  type AppliedChip = { key: string; raw: string | null; label: string };

  const applied: AppliedChip[] = Object.entries(value).flatMap(([key, v]): AppliedChip[] => {
    if (!v) return [];
    const facet = facets.find((f) => f.key === key);
    if (!facet) return [];
    if (facet.kind === 'range') {
      const [from, to] = v as [number, number];
      return [{ key, raw: null, label: `${facet.title}: ${from}–${to}` }];
    }
    return (v as string[]).map((raw) => ({ key, raw, label: labelOf(facet, raw) }));
  });

  const remove = (key: string, raw: string | null) => {
    const next = { ...value };
    if (raw === null) delete next[key];
    else {
      const rest = ((next[key] as string[]) ?? []).filter((x) => x !== raw);
      if (rest.length) next[key] = rest;
      else delete next[key];
    }
    onChange(next);
  };

  const body = (
    <Stack gap="xl">
      {facets.map((facet) =>
        facet.kind === 'checkbox' ? (
          <CheckboxGroup
            key={facet.key}
            label={facet.title}
            value={(value[facet.key] as string[]) ?? []}
            onChange={(next) => onChange({ ...value, [facet.key]: next.length ? next : undefined })}
          >
            {facet.values.map((v) => (
              <Checkbox key={v.value} value={v.value}>
                <span className={s.optionRow}>
                  <span>{v.label ?? v.value}</span>
                  {v.count != null ? <span className={s.count}>{v.count}</span> : null}
                </span>
              </Checkbox>
            ))}
          </CheckboxGroup>
        ) : (
          <Slider
            key={facet.key}
            label={facet.title}
            minValue={facet.min}
            maxValue={facet.max}
            step={facet.step}
            formatValue={facet.formatValue}
            value={(value[facet.key] as [number, number]) ?? [facet.min, facet.max]}
            onChange={(v) =>
              onChange({ ...value, [facet.key]: v as [number, number] })
            }
          />
        ),
      )}
    </Stack>
  );

  const chips = applied.length ? (
    <div className={s.chips}>
      {applied.map((a) => (
        <Chip key={`${a.key}:${a.raw ?? ''}`} onRemove={() => remove(a.key, a.raw)}>
          {a.label}
        </Chip>
      ))}
      <Button variant="ghost" onPress={() => onChange({})}>
        Сбросить всё
      </Button>
    </div>
  ) : null;

  return (
    <>
      {/* Десктоп: панель в колонке. */}
      <aside className={s.desktop} aria-label="Фильтры">
        {chips}
        {body}
      </aside>

      {/* Мобильный: кнопка + шторка. */}
      <div className={s.mobile}>
        {chips}
        <Button onPress={() => setOpen(true)}>
          Фильтры{applied.length ? ` (${applied.length})` : ''}
        </Button>
        <Drawer isOpen={isOpen} onOpenChange={setOpen} title="Фильтры">
          {body}
          <Button onPress={() => setOpen(false)}>
            {resultCount != null ? `Показать ${resultCount}` : 'Применить'}
          </Button>
        </Drawer>
      </div>
    </>
  );
}
