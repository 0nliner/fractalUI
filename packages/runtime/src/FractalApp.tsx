import { useState } from 'react';
import { vars } from '@fractalui/tokens';
import { Button, Drawer } from '@fractalui/primitives';
import { AutoTable, Feed, AutoForm, Navigation } from '@fractalui/patterns';
import type { AppConfig, PageConfig } from './types';

function PageView({ page }: { page: PageConfig }) {
  const [formOpen, setFormOpen] = useState(false);
  const create = page.createAction;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: vars.space.md }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0, fontSize: vars.font.sizeLg, fontWeight: vars.font.weightBold }}>{page.title}</h2>
        {create ? <Button onPress={() => setFormOpen(true)}>{create.label}</Button> : null}
      </header>

      {page.visualization.type === 'table' ? (
        <AutoTable columns={page.visualization.columns} data={page.data} />
      ) : (
        <Feed items={page.data} fields={page.visualization.fields} />
      )}

      {create ? (
        <Drawer isOpen={formOpen} onOpenChange={setFormOpen} title={create.label}>
          <AutoForm
            schema={create.schema}
            submitLabel={create.label}
            onSubmit={(values) => {
              create.onSubmit(values);
              setFormOpen(false);
            }}
          />
        </Drawer>
      ) : null}
    </section>
  );
}

/**
 * Конфиг-движок (L3): собирает приложение из AppConfig — навигация + страницы,
 * каждая страница рендерит AutoTable/Feed и опционально форму создания (AutoForm).
 * Данные приходят из конфига (в примере — мок; в проде — data-адаптер на hey-api).
 */
export function FractalApp({ config }: { config: AppConfig }) {
  const [activeKey, setActiveKey] = useState<string | undefined>(config.pages[0]?.key);
  const active = config.pages.find((p) => p.key === activeKey) ?? config.pages[0];

  const navItems = config.pages.map((p) => ({
    id: p.key,
    label: p.title,
    icon: p.icon,
    active: p.key === active?.key,
    onPress: () => setActiveKey(p.key),
  }));

  return (
    <div style={{ display: 'flex', gap: vars.space.lg, alignItems: 'flex-start', minHeight: 420 }}>
      <Navigation title={config.brand?.title} logo={config.brand?.logo} items={navItems} />
      <main style={{ flex: 1, minWidth: 0 }}>{active ? <PageView page={active} /> : null}</main>
    </div>
  );
}
