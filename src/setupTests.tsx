import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';
import { webcrypto } from 'crypto';

vi.mock('framer-motion', async () => {
	const actual = await vi.importActual<typeof import('./__mocks__/framer-motion')>(
		'./__mocks__/framer-motion',
	);
	return { ...actual };
});

// ─── CRYPTO POLYFILL ────────────────────────────────
if (!globalThis.crypto) {
	Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
}
