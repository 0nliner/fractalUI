import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Chip,
  Gallery,
  Inline,
  Rating,
  Section,
  Stack,
  TextField,
} from '@fractalui/primitives';
import { CardGrid, FilterPanel, StorefrontShell, Toaster, type Facet, type FilterValue } from '@fractalui/patterns';
import { vars } from '@fractalui/tokens';
import { catalogLayout } from './Storefront.css';

/**
 * Витринный каркас в сборе: шапка, фасеты, сетка карточек, пагинация, тосты.
 * Проверяется на 375 / 768 / 1280 — ниже md фильтры уезжают в шторку,
 * а номера страниц схлопываются в «N / M».
 */

type Item = { id: string; title: string; price: number; rating: number; tag: string; image: string };

const PALETTE = ['#c2603f', '#7a8b6f', '#b3781a', '#5b7f9d', '#8d6e63', '#6d7f8b'];

const ALL: Item[] = Array.from({ length: 33 }, (_, i) => ({
  id: String(i),
  title: [
    'Кружка ручной работы',
    'Керамическая ваза',
    'Деревянная разделочная доска',
    'Льняная скатерть',
    'Серьги из латуни',
  ][i % 5]!,
  price: 900 + (i % 7) * 850,
  rating: 3.4 + ((i * 7) % 16) / 10,
  tag: ['ceramics', 'wood', 'textile'][i % 3]!,
  // Данных нет — рисуем плашку цветом, чтобы стори не ходила в сеть.
  image: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="${PALETTE[i % PALETTE.length]}"/></svg>`,
  )}`,
}));

const FACETS: Facet[] = [
  {
    kind: 'checkbox',
    key: 'tag',
    title: 'Категория',
    values: [
      { value: 'ceramics', label: 'Керамика', count: 11 },
      { value: 'wood', label: 'Дерево', count: 11 },
      { value: 'textile', label: 'Текстиль', count: 11 },
    ],
  },
  {
    kind: 'range',
    key: 'price',
    title: 'Цена',
    min: 0,
    max: 8000,
    step: 100,
    formatValue: (v) => (Array.isArray(v) ? `${v[0]} — ${v[1]} ₽` : `${v} ₽`),
  },
];

const PER_PAGE = 8;

function ProductCard({ item, onAdd }: { item: Item; onAdd: () => void }) {
  return (
    <Card style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <img src={item.image} alt="" style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover' }} />
      <Stack gap="sm" style={{ padding: vars.space.md, flex: 1 }}>
        <Inline justify="space-between" align="flex-start" gap="sm">
          <span style={{ fontWeight: vars.font.weightMedium }}>{item.title}</span>
          <Badge>{item.tag}</Badge>
        </Inline>
        <Rating value={item.rating} size="sm" label={item.rating.toFixed(1)} />
        <Inline justify="space-between" style={{ marginTop: 'auto' }}>
          <strong style={{ fontSize: vars.font.sizeXl }}>{item.price.toLocaleString('ru')} ₽</strong>
          <Button onPress={onAdd}>В корзину</Button>
        </Inline>
      </Stack>
    </Card>
  );
}

function Storefront() {
  const [filters, setFilters] = useState<FilterValue>({});
  const [page, setPage] = useState(1);
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);

  const filtered = useMemo(() => {
    const tags = filters.tag as string[] | undefined;
    const price = filters.price as [number, number] | undefined;
    return ALL.filter(
      (i) =>
        (!tags?.length || tags.includes(i.tag)) &&
        (!price || (i.price >= price[0] && i.price <= price[1])),
    );
  }, [filters]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <StorefrontShell
      brand={<strong style={{ fontSize: vars.font.sizeLg }}>CraftSphere</strong>}
      search={<TextField aria-label="Поиск" placeholder="Найти товар или мастера" />}
      nav={
        <Inline gap="lg">
          <a href="#!">Товары</a>
          <a href="#!">Мастер-классы</a>
          <a href="#!">Мастера</a>
        </Inline>
      }
      actions={
        <>
          <Button variant="ghost">Войти</Button>
          <Button>Корзина</Button>
        </>
      }
      footer={<span>© CraftSphere — маркетплейс мастеров</span>}
    >
      <Section
        title="Каталог"
        description={`Найдено ${filtered.length}`}
        action={<Chip onPress={() => setFilters({})}>Сбросить</Chip>}
      >
        {/* Композиция «фильтры сбоку» — забота страницы, не компонентов.
            Ниже md колонка фильтров схлопывается: панель там всё равно скрыта,
            а её место занимает кнопка со шторкой. */}
        <div className={catalogLayout}>
          <FilterPanel
            facets={FACETS}
            value={filters}
            onChange={(v) => {
              setFilters(v);
              setPage(1);
            }}
            resultCount={filtered.length}
          />
          <CardGrid
            items={visible}
            getKey={(i) => i.id}
            page={safePage}
            pageCount={pageCount}
            onPageChange={setPage}
            renderItem={(item) => (
              <ProductCard
                item={item}
                onAdd={() =>
                  setToasts((t) => [...t, { id: `${item.id}-${t.length}`, message: `«${item.title}» в корзине` }])
                }
              />
            )}
          />
        </div>
      </Section>

      <Section title="Галерея товара">
        <div style={{ maxWidth: 420 }}>
          <Gallery images={ALL.slice(0, 4).map((i) => i.image)} alt="Пример товара" />
        </div>
      </Section>

      <Toaster
        items={toasts.map((t) => ({ ...t, status: 'success' as const }))}
        onDismiss={(id) => setToasts((list) => list.filter((t) => t.id !== id))}
      />
    </StorefrontShell>
  );
}

const meta: Meta<typeof Storefront> = { title: 'Examples/Storefront', component: Storefront };
export default meta;
export const Catalog: StoryObj<typeof Storefront> = {};
