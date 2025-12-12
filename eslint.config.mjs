// eslint.config.js
import { defineConfig } from 'eslint'
import eslint from '@eslint/js'
import obsidian from 'eslint-plugin-obsidianmd'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig(
  // global ignore files
  {
    ignores: ['main.js', 'dist/', 'node_modules/'],
  },
  // base configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  obsidian.configs.recommended,

  // custom rules
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // Add custom rules here if needed
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // prettier config
  eslintConfigPrettier,
)

// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   eslint.configs.recommended,
//   eslintPluginPrettierRecommended,
//   {
//     rules: {
//       "no-console": "warn",
//     },
//   },
// ]);
