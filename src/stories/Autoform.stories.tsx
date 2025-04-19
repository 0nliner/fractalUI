import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import React, { useState } from 'react';
import { AutoForm, AutoFormProps } from '../autoforms';
import { AppProviderContext } from '../providers/AppProvider';
import mockedSpec from '../mocks/MetalMarketHub_openapi.json';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@easyUI/providers/themeSwitcher';


const muiTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            padding: 0,
            margin: 0,
            color: 'white',
            backgroundColor: 'transparent',
            fontSize: '0.7em',
            height: '24px',
            borderRadius: '6px !important',
            '& .MuiInputBase-input': {
              padding: '4px 8px',
            },
          },
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true // Фиксируем label в верхнем положении
      },
      styleOverrides: {
        root: {
          left: "-14px !important",
          fontSize: "0.8em !important",
          // marginBottom: "5px !important", 
          top: "-4px !important",
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&:before, &:after': {
            borderBottom: 'none !important',
          },
        },
        input: {
          padding: '4px 8px !important',
          outline: "none !important",
          borderRadius: "6px !important",
          backgroundColor: "#1a1a1a",
          "&:focus": {
            // boxShadow: "0 0 0 1px #646cff !important"
            // backgroundColor: "#1a1a1a"
          },
          "&:hover": {
            // backgroundColor: "#1a1a1a"
            // boxShadow: "0 0 0 1px #646cff !important"
          }
          // '&:fieldset': {
          //   border: 'none !important',
          // }
        },
        
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none', // Убираем границу fieldset
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none', // Убираем границу при hover
            boxShadow: '0 0 0 3px #ffffff',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none', // Убираем границу при фокусе
          },
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield', // Firefox
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
              WebkitAppearance: 'none', // Safari, Chrome
              margin: 0, // Убираем отступы
            },
          },
        },
        notchedOutline: {
          'legend': {
            display: 'none'
          }
        }
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: '1em',
        },
        subtitle2: {
          fontSize: '0.8em',
          color: "rgb(89, 89, 89) !important",
          opacity: 0.4
        }
      }
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          // padding: '0 !important',
        },
        item: {
          paddingTop: "2px !important"
        }}
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.7em',
          // top: "-12px !important"
          top: "0px !important"
        }
      }
    },
    MuiFormControlLabel : {
      styleOverrides: {
        root: {
          fontSize: '0.7em',
          height: '24px',
        },
        
      }
    }
  },
});


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
          <ThemeProvider theme={muiTheme}>
              <Story {...context} />
          </ThemeProvider>
        </AppProviderContext.Provider>
    </div>
  );
};

// export const withMuiTheme = (Story) => (
//     <CssBaseline />
//     <Story />
//   </ThemeProvider>
// );

const meta: Meta<typeof AutoForm> = {
  title: 'Components/AutoForm',
  component: AutoForm,
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
    }
  }
};

export default meta;

type Story = StoryObj<typeof AutoForm>;

// Базовая история
export const Default: Story = {
  args: {
    schemaName: "ShedulerCreateConfigurationDTO",
    handleSubmit: (formData) => console.log('Form submitted:', formData),
    UISchema: {}
  },
};

// История с UI Schema
export const WithUISchema: Story = {
  args: {
    schemaName: "ShedulerCreateConfigurationDTO",
    handleSubmit: (formData) => console.log('Form submitted:', formData),
    UISchema: {
      "ui:title": "Создание автоматизации",

      "vendor_id": {
        "ui:title": "Поставщик"
      },

      "enabled": {
        "ui:title": "Включить ли автоматизацию ?"
      },

      "document_name": {
        "ui:title": "название документа",
        "ui:help": "название документа"
      },

      "puppteer_configuration": {
        "ui:title": "Файл автоматизации"
      },

      "interval": {
        "ui:title": "Интервал через который происходит повторная загрузка",

        "years": {
          "ui:title": "Года"
        },

        "days": {
          "ui:title": "Дни"
        },

        "time": {
          "ui:title": "Время"
        }
      }
    }
  },
};