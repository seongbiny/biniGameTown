import vanillaConfig from '@internal/eslint-config/vanilla.config.js';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...vanillaConfig,
  {
    rules: {
      // 필요한 경우, 프로젝트 특화 규칙 추가
      '@typescript-eslint/no-unused-vars': ['warn', { ignoreEnums: true }],
    },
  },
];

export default config;
