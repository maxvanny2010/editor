import React from 'react';
import { Provider } from 'react-redux';
import { makeTestStore, type TestRootState } from './testStore';

interface TestProviderProps {
	children: React.ReactNode;
	initialState?: Partial<TestRootState>;
}

export function TestStoreProvider({ children, initialState }: TestProviderProps) {
	const store = makeTestStore(initialState);
	return <Provider store={store}>{children}</Provider>;
}
