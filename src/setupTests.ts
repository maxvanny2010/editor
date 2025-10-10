import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

import { webcrypto } from 'crypto';

if (!globalThis.crypto) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(globalThis as any).crypto = webcrypto as unknown as Crypto;
}
