import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { fileURLToPath } from 'node:url';

const fromHere = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Алиасим пакеты кита на исходники (live-обновление + VE собирает *.css.ts).
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  server: { port: 5174, strictPort: false },
  resolve: {
    alias: {
      '@fractalui/tokens': fromHere('../../packages/tokens/src/index.ts'),
      '@fractalui/primitives': fromHere('../../packages/primitives/src/index.ts'),
      '@fractalui/patterns': fromHere('../../packages/patterns/src/index.ts'),
      '@fractalui/runtime': fromHere('../../packages/runtime/src/index.ts'),
    },
  },
});
