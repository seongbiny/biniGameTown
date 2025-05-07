import vanillaConfig from '@internal/eslint-config/vanilla.config.js';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...vanillaConfig,
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          args: 'none',
        },
        'warn',
        { ignoreEnums: true },
      ],
    },
  },
];

export default config;
