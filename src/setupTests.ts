// jest-dom matchers
import '@testing-library/jest-dom';

// fake-indexeddb for Dexie
import 'fake-indexeddb/auto';

// webcrypto for nanoid / etc. in Node.js environment
import { webcrypto } from 'crypto';

// Polyfill for Web Crypto API in Node.js
if (!globalThis.crypto) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(globalThis as any).crypto = webcrypto as unknown as Crypto;
}
