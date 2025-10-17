import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';
import { webcrypto } from 'crypto';

vi.mock('framer-motion', async () => {
	const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
	const mock = await import('@/__mocks__/framer-motion');
	return { ...actual, ...mock };
});

// ─── CRYPTO POLYFILL ────────────────────────────────
if (!globalThis.crypto) {
	Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
}
