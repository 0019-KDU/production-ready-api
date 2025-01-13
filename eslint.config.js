import js from '@eslint/js';

/** @type {import('eslint').FlatConfig[]} */
export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'off',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-await-in-loop': 'off',
    },
  },
];
