import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import type { Observable, Store } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import { UpdateProjectModal } from '@/features/project-update/model';
import { ProjectModalBase } from '@/entities/project/ui/_shared';

vi.mock('@/entities/project/ui/_shared', async (importOriginal) => {
	const actual = (await importOriginal()) as Record<string, unknown>;
	return {
		...actual,
		ProjectModalBase: vi.fn(() => <div data-testid="modal-base" />),
	};
});

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
				<UpdateProjectModal projectId="1" initialName="Old" onClose={onClose} />
			</Provider>,
		);

		expect(ProjectModalBase).toHaveBeenCalledWith(
			expect.objectContaining({
				title: 'Update project name',
				buttonLabel: 'Update',
				onClose,
				initialValue: 'Old',
				buildArgs: expect.any(Function),
				onSubmitAction: expect.any(Function),
				'data-testid': 'update-modal',
			}),
			undefined,
		);
	});
});
