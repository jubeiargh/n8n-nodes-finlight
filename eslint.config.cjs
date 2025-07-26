const eslintPluginN8nNodesBase = require('eslint-plugin-n8n-nodes-base');
const parser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'n8n-nodes-base': eslintPluginN8nNodesBase,
    },
    rules: {
      'n8n-nodes-base/node-param-array-type-assertion': 'warn',
      'n8n-nodes-base/node-param-default-wrong-for-collection': 'error',
    },
  },
];
