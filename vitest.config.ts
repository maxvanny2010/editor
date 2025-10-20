import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		environment: 'jsdom',
		globals: true,
		isolate: true,
		mockReset: true,
		restoreMocks: true,
		clearMocks: true,
		css: false,
		pool: 'forks',
		poolOptions: { threads: { singleThread: true } },
		slowTestThreshold: 1000,
		setupFiles: [path.resolve(__dirname, './src/setup.tests.tsx')],
		coverage: {
			provider: 'istanbul',
			reporter: ['text', 'lcov', 'html'],
			reportsDirectory: './coverage',
			clean: true,
			exclude: [
				'**/__tests__/**',
				'**/*.d.ts',
				'**/index.*',
				'**/config.*',
				'**/dexie.*',
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
				'src/shared/schema',
				'src/shared/constants',
			],
		},
		server: {
			deps: { inline: [/vitest/] },
		},
	},
});
