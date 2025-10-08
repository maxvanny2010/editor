import React from 'react';
import { Provider } from 'react-redux';
import { makeTestStore } from '@/test-utils/testStore.ts';

/**
 * Provides an isolated Redux store for each test.
 * Automatically uses makeTestStore(), so every test starts clean.
 */
export function TestStoreProvider({ children }: { children: React.ReactNode }) {
	const store = makeTestStore();
	return <Provider store={store}>{children}</Provider>;
}
