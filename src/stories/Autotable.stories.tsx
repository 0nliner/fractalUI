// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import React, { useState } from 'react';
import { AutoForm, AutoFormProps } from '../autoforms/AutoForm';
import { AppProviderContext } from '../providers/AppProvider';
import mockedSpec from '../mocks/MetalMarketHub_openapi.json';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@easyUI/providers/themeSwitcher';

// Типы для нашего мока
interface MockContextValue {
  openapiSpec: any;
  setOpenapiSpec: (spec: any) => void;
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
    setOpenapiSpec: (spec) => setSpecJson(JSON.stringify(spec, null, 2))
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
            <Story {...context} />
        </AppProviderContext.Provider>
    </div>
  );
};

// export const withMuiTheme = (Story) => (
//     <CssBaseline />
//     <Story />
//   </ThemeProvider>
// );

const meta: Meta<typeof AutoTable> = {
  title: 'Components/AutoTable',
  component: AutoTable,
  decorators: [withMockAppProvider],
  tags: ['autodocs'],
  argTypes: {
    schemaName: {
      control: 'text',
      description: 'Name of the schema in OpenAPI spec'
    },
    handleSubmit: {
      action: 'submitted',
      description: 'Form submit handler'
    },
    pageAlias: {
        control: 'text',
        description: 'Название страницы'
    },
  }
};

export default meta;

type Story = StoryObj<typeof AutoTable>;

// Базовая история
export const Default: Story = {
  args: {
    schemaName: "ShedulerCreateConfigurationDTO",
    handleSubmit: (formData) => console.log('Form submitted:', formData),
    UISchema: {}
  },
};
