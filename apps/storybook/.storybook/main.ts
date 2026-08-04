import type { StorybookConfig } from '@storybook/react-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { fileURLToPath } from 'node:url';

const fromHere = (p: string) => fileURLToPath(new URL(p, import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/react-vite', options: {} },
  async viteFinal(cfg) {
    cfg.plugins = cfg.plugins ?? [];
    cfg.plugins.push(vanillaExtractPlugin());
    // Алиасим пакеты кита на исходники: live-обновление + VE-плагин сам собирает
    // *.css.ts (vite, в отличие от esbuild-lib, инжектит CSS автоматически).
    cfg.resolve = cfg.resolve ?? {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias ?? {}),
      '@fractalui/tokens': fromHere('../../../packages/tokens/src/index.ts'),
      '@fractalui/primitives': fromHere('../../../packages/primitives/src/index.ts'),
      '@fractalui/patterns': fromHere('../../../packages/patterns/src/index.ts'),
      '@fractalui/runtime': fromHere('../../../packages/runtime/src/index.ts'),
    };
    return cfg;
  },
};

export default config;
