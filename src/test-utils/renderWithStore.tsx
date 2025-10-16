import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { makeTestStore } from '@/test-utils/testStore';
import type { RootState } from '@/store';

/**
 * Renders a React component inside Redux + Router context.
 * Returns both the store and testing-library utilities.
 *
 * If DOM stays empty (e.g., modal didn't render), it logs a snapshot automatically.
 */
export function renderWithStore<S extends Partial<RootState> = Partial<RootState>>(
	ui: React.ReactElement,
	{ initialState }: { initialState?: S } = {},
) {
	const store = makeTestStore(initialState);
	const utils = render(
		<Provider store={store}>
			<MemoryRouter>{ui}</MemoryRouter>
		</Provider>,
	);

	return { store, ...utils };
}
