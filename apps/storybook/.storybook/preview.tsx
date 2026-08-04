import type { Preview, Decorator } from '@storybook/react';
import { lightTheme, darkTheme, vars } from '@fractalui/tokens';

const themes = { light: lightTheme, dark: darkTheme } as const;

const withTheme: Decorator = (Story, context) => {
  const key = context.globals.theme as keyof typeof themes;
  const themeClass = themes[key] ?? darkTheme;
  return (
    <div
      className={themeClass}
      style={{
        background: vars.color.bg,
        color: vars.color.fg,
        fontFamily: vars.font.family,
        fontSize: vars.font.sizeMd,
        minHeight: '100vh',
        padding: vars.space.xl,
        boxSizing: 'border-box',
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Тема fractalUI',
      defaultValue: 'dark',
      toolbar: {
        title: 'Тема',
        icon: 'circlehollow',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
  },
};

export default preview;
