import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { makeTestStore, type TestRootState } from './testStore';

interface RenderWithStoreOptions {
	initialState?: Partial<TestRootState>;
}

/**
 * Renders a React component wrapped with a Redux Provider using a fresh test store.
 *
 * @example
 * const { store } = renderWithStore(<MyComponent />, { initialState: { projects: { ... } } });
 */
export const renderWithStore = (
	ui: React.ReactElement,
	options: RenderWithStoreOptions = {},
) => {
	const store = makeTestStore(options.initialState);
	const utils = render(<Provider store={store}>{ui}</Provider>);
	return { store, ...utils };
};
