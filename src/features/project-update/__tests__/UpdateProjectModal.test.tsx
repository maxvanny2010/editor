import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import type { Observable, Store } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import { ProjectModalBase } from '@/entities/project/ui/_shared';
import { UpdateProjectModal } from '@/features/project-update/model';

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

describe('UpdateProjectModal', () => {
	it('renders ProjectModalBase with correct props', () => {
		const onClose = vi.fn();

		render(
			<Provider store={fakeStore}>
				<UpdateProjectModal
					projectId="1"
					initialName="Old Name"
					onClose={onClose}
				/>
			</Provider>,
		);

		expect(ProjectModalBase).toHaveBeenCalledWith(
			expect.objectContaining({
				title: 'Update project name',
				buttonLabel: 'Update',
				initialValue: 'Old Name',
				onClose,
				buildArgs: expect.any(Function),
				onSubmitAction: expect.any(Function),
				'data-testid': 'update-modal',
			}),
			undefined,
		);
	});
});
