import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	globalIgnores([
		'dist',
		'build',
		'coverage',
		'node_modules',
		'*.log',
		'.vscode',
		'.idea',
		'package-lock.json',
		'pnpm-lock.yaml',
		'yarn.lock',
	]),
	{
		files: ['**/*.{ts,tsx}'],
		plugins: {
			react,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			'@typescript-eslint': tseslint.plugin,
		},
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		languageOptions: {
			ecmaVersion: 'latest',
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				ecmaFeatures: { jsx: true },
			},
		},
		settings: {
			react: { version: 'detect' },
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'react-refresh/only-export-components': 'warn',
		},
	},
]);
