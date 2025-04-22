// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import React, { useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Edit, Factory } from '@mui/icons-material';
import { AutoForm, AutoFormProps } from '../autoforms/AutoForm';
import { AppProviderContext } from '../providers/AppProvider';
import { theme } from '@easyUI/providers/themeSwitcher';
import { MinimalisticActionsList } from '../components/ActionsList/MinimalisticActionsList';
import { BrowserRouter } from "react-router-dom";

import mockedSpec from '../mocks/MetalMarketHub_openapi.json';
import * as api_sdk_module from '../mocks/api_sdk_mock/sdk.gen'; 

// Типы для нашего мока
interface MockContextValue {
  openapiSpec: any;
  setOpenapiSpec: (spec: any) => void;
  api_sdk_module: any
}

// Декоратор с возможностью выбора источника спецификации
const withMockAppProvider = (Story, context) => {
  const [specSource, setSpecSource] = useState<'url' | 'json'>('json');
  const [specUrl, setSpecUrl] = useState('');
  const [specJson, setSpecJson] = useState(JSON.stringify(mockedSpec, null, 2));

  const loadSpecFromUrl = async () => {
    try {
      const response = await fetch(specUrl);
      const data = await response.json();
      setSpecJson(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error loading spec:', error);
    }
  };

  const mockContextValue: MockContextValue = {
    openapiSpec: JSON.parse(specJson),
    setOpenapiSpec: (spec) => setSpecJson(JSON.stringify(spec, null, 2)),
    api_sdk_module: api_sdk_module
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select 
          value={specSource} 
          onChange={(e) => setSpecSource(e.target.value as 'url' | 'json')}
        >
          <option value="json">JSON String</option>
          <option value="url">URL</option>
        </select>

        {specSource === 'url' ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={specUrl}
              onChange={(e) => setSpecUrl(e.target.value)}
              placeholder="Enter OpenAPI spec URL"
              style={{ flex: 1 }}
            />
            <button onClick={loadSpecFromUrl}>Load</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <small>Edit JSON spec:</small>
            <textarea
              value={specJson}
              onChange={(e) => setSpecJson(e.target.value)}
              rows={10}
              style={{ width: '100%', fontFamily: 'monospace' }}
            />
          </div>
        )}
      </div>
        {/* @ts-ignore */}
        <AppProviderContext.Provider value={mockContextValue}>
            <BrowserRouter>
                <Story {...context} />
            </BrowserRouter>
        </AppProviderContext.Provider>
    </div>
  );
};


const meta: Meta<typeof AutoTable> = {
  title: 'Components/MinimalisticActionsList',
  component: MinimalisticActionsList,
  decorators: [withMockAppProvider],
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Позиция списка действий',
      defaultValue: 'right',
    },
    blocks: {
      control: 'object',
      description: 'Блоки действий',
      defaultValue: [],
    },
    Component: {
      control: false, // Отключаем контроль для React-компонента
      description: 'Кастомная обертка компонента',
    //   defaultValue: MinimalisticActionsList,
    },
    'blocks[].title': {
      control: 'text',
      description: 'Заголовок блока действий',
    },
    'blocks[].unpack': {
      control: 'boolean',
      description: 'Развернуть ли блок по умолчанию',
      defaultValue: false,
    },
    'blocks[].icon': {
      control: false, // Отключаем контроль для React-элемента
      description: 'Иконка для блока',
      defaultValue: <Factory />,
    },
    'blocks[].actions': {
      control: 'object',
      description: 'Список действий в блоке',
    },
  },
};

export default meta;

type Story = StoryObj<typeof MinimalisticActionsList>;

// Базовая история
// export const Default: Story = {
//   args: {
//     schemaName: "ShedulerCreateConfigurationDTO",
//     handleSubmit: (formData) => console.log('Form submitted:', formData),
//     UISchema: {}
//   },
// };
export const Default: Story = {
    args: {
      position: 'left',
      isVertical: true,
      blocks: [
        {
          title: 'Основные действия',
          unpack: true,
          actions: [
            // @ts-ignore
            { label: 'Действие 1', icon: <Factory />, onClick: () => console.log('Действие 1') },
            // @ts-ignore
            { label: 'Действие 2', icon: <Edit/>, onClick: () => console.log('Действие 2') },
          ],
        },
      ],
    },
  };