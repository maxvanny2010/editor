import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'framer-motion': path.resolve(__dirname, './src/__mocks__/framer-motion.tsx'),
		},
	},
	test: {
		environment: 'jsdom',
		globals: true,
		isolate: false,
		mockReset: true,
		css: false,
		pool: 'forks',
		poolOptions: { threads: { singleThread: true } },
		slowTestThreshold: 1000,
		setupFiles: ['./src/setupTests.tsx'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov', 'html'],
			reportsDirectory: './coverage',
			clean: true,
			exclude: [
				'**/__tests__/**',
				'**/index.*',
				'**/*.d.ts',
				'**/config.*',
				'**/vite.config.*',
				'**/vitest.config.*',
				'**/postcss.config.*',
				'**/eslint.config.*',
				'**/setupTests.*',
				'**/framer-motion.tsx*',
				'**/ci-trigger.*',
				'**/main.tsx',
				'**/App.tsx',
				'**/router.tsx',
				'**/StoreProvider.tsx',
				'**/selectors.*',
				'**/makeSelectors.ts',
				'src/test-utils/**',
				'**/HomeLayout.tsx',
			],
		},
		server: {
			deps: {
				inline: [/vitest/],
			},
		},
	},
});
