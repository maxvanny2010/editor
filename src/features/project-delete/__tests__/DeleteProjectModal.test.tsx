import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { Observable, Store } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

vi.mock('@/entities/project/ui/_shared', async (importOriginal) => {
	const actual = (await importOriginal()) as Record<string, unknown>;
	return {
		...actual,
		ProjectModalBase: vi.fn(() => <div data-testid="modal-base" />),
	};
});

import { DeleteProjectModal } from '@/features/project-delete/model';
import { ProjectModalBase } from '@/entities/project/ui/_shared';

const mockObservable: Observable<RootState> = {
	subscribe: vi.fn(),
	[Symbol.observable]() {
		return this;
	},
};

const fakeStore: Store<RootState> = {
	getState: () => ({}) as RootState,
	dispatch: vi.fn(),
	subscribe: vi.fn(),
	replaceReducer: vi.fn(),
	[Symbol.observable]: () => mockObservable,
};

describe('DeleteProjectModal', () => {
	it('renders ProjectModalBase with correct props', () => {
		const onClose = vi.fn();

		render(
			<Provider store={fakeStore}>
				<DeleteProjectModal
					projectId="42"
					projectName="Test Project"
					onClose={onClose}
				/>
			</Provider>,
		);

		expect(ProjectModalBase).toHaveBeenCalledWith(
			expect.objectContaining({
				title: 'Delete project',
				buttonLabel: 'Delete',
				onClose,
				buildArgs: expect.any(Function),
				onSubmitAction: expect.any(Function),
				showInput: false,
				customContent: expect.any(Object),
				'data-testid': 'delete-modal',
			}),
			undefined,
		);
	});
});
