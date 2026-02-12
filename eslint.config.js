import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{ts,tsx}'],
		plugins: {
			import: importPlugin,
			'unused-imports': unusedImports,
		},
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			// 1. 사용하지 않는 import 자동 제거
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],

			// 2. Import 순서 자동 정렬
			'import/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						['parent', 'sibling'],
						'index',
						'object',
						'type',
						'unknown',
					],
					pathGroups: [
						{ pattern: 'react', group: 'builtin', position: 'before' },
						{ pattern: '@/**', group: 'internal', position: 'before' },
					],
					pathGroupsExcludedImportTypes: ['react'],
					'newlines-between': 'always',
					alphabetize: { order: 'asc', caseInsensitive: true },
				},
			],

			// 3. 기타 추천 규칙
			'@typescript-eslint/consistent-type-imports': 'error', // Type import 강제
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		},
	},
]);
