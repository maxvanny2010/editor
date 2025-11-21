import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { type TestRootState, TestStoreProvider } from '@/test-utils';

/**
 * Renders a React component inside Redux + Router context.
 * Returns both the store and testing-library utilities.
 */
export function renderWithStore(
	ui: React.ReactElement,
	options?: { initialState?: Partial<TestRootState> },
) {
	return render(
		<TestStoreProvider initialState={options?.initialState}>
			<MemoryRouter>{ui}</MemoryRouter>
		</TestStoreProvider>,
	);
}
