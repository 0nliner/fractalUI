import type { ReactNode } from 'react';
import { Tabs as AriaTabs, TabList, Tab, TabPanel } from 'react-aria-components';
import * as s from './Tabs.css';

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

export type TabsProps = {
  items: TabItem[];
  defaultSelectedKey?: string;
  'aria-label'?: string;
};

/** Вкладки на React Aria. */
export function Tabs({ items, defaultSelectedKey, 'aria-label': ariaLabel = 'Tabs' }: TabsProps) {
  return (
    <AriaTabs className={s.root} defaultSelectedKey={defaultSelectedKey}>
      <TabList className={s.list} aria-label={ariaLabel}>
        {items.map((t) => (
          <Tab key={t.id} id={t.id} className={s.tab}>
            {t.label}
          </Tab>
        ))}
      </TabList>
      {items.map((t) => (
        <TabPanel key={t.id} id={t.id} className={s.panel}>
          {t.content}
        </TabPanel>
      ))}
    </AriaTabs>
  );
}
