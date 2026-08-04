// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * Запрет легаси-стека во всех новых пакетах кита.
 * MUI / RJSF / material-react-table / Recoil — не добавлять в packages кита.
 */
const legacyStackBan = {
  patterns: [
    { group: ['@mui/*'], message: 'MUI — легаси. Используй React Aria + @fractalui/tokens.' },
    { group: ['@rjsf/*'], message: 'RJSF — легаси. Используй React Hook Form + AJV.' },
    { group: ['material-react-table'], message: 'MRT — легаси. Используй TanStack Table.' },
    { group: ['recoil'], message: 'Recoil — мёртв. Используй Zustand / TanStack Query.' },
  ],
};

/** Бан импорта вышестоящих/боковых слоёв по правилу зависимостей. */
const banLayers = (...names) => ({
  'no-restricted-imports': [
    'error',
    {
      ...legacyStackBan,
      patterns: [
        ...legacyStackBan.patterns,
        ...names.map((n) => ({
          group: [`@fractalui/${n}`, `@fractalui/${n}/*`],
          message: `Нарушение слоёв: импорт @fractalui/${n} запрещён на этом слое (только вниз по стрелке tokens←primitives←patterns←runtime).`,
        })),
      ],
    },
  ],
});

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '**/storybook-static/**', 'packages/legacy/**'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Общие правила качества для всего кита
  {
    files: ['packages/**/*.{ts,tsx}', 'apps/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      'no-restricted-imports': ['error', legacyStackBan],
    },
  },

  // Правило зависимостей по слоям (string-based, без резолвера)
  { files: ['packages/tokens/**/*.{ts,tsx}'], rules: banLayers('primitives', 'patterns', 'runtime', 'data', 'icons') },
  { files: ['packages/icons/**/*.{ts,tsx}'], rules: banLayers('primitives', 'patterns', 'runtime', 'data') },
  { files: ['packages/primitives/**/*.{ts,tsx}'], rules: banLayers('patterns', 'runtime', 'data') },
  { files: ['packages/data/**/*.{ts,tsx}'], rules: banLayers('primitives', 'patterns', 'runtime') },
  { files: ['packages/patterns/**/*.{ts,tsx}'], rules: banLayers('runtime', 'data') },
  // runtime — верхний слой, ничего внутреннего не запрещаем (только легаси-стек)

  // Сторибук/конфиги — послабления
  {
    files: ['**/*.stories.{ts,tsx}', '**/*.config.{ts,mts,js,mjs}', 'apps/**'],
    rules: { 'no-console': 'off', 'no-restricted-imports': 'off' },
  },
);
