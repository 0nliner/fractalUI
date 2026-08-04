import { defineConfig } from 'tsup';
import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // Компиляция *.css.ts → CSS (тема в виде классов + переменных)
  esbuildPlugins: [vanillaExtractPlugin()],
});
