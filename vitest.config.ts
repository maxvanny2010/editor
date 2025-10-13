import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		environment: 'jsdom',
		globals: true,
		isolate: false,
		setupFiles: ['./src/setupTests.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov', 'html'],
			reportsDirectory: './coverage',
			exclude: [
				'**/index.*',
				'**/*.d.ts',
				'**/config.*',
				'**/vite.config.*',
				'**/vitest.config.*',
				'**/postcss.config.*',
				'**/eslint.config.*',
				'**/setupTests.*',
				'**/ci-trigger.*',
				'**/main.tsx',
				'**/App.tsx',
				'**/router.tsx',
				'**/StoreProvider.tsx',
				'**/selectors.*',
				'**/makeSelectors.ts',
			],
		},
		server: {
			deps: {
				inline: [/vitest/],
			},
		},
	},
});
