import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ProjectModalBase } from '../ProjectModalBase';
import { PROJECT_MESSAGES } from '@/shared/constants';

vi.mock('@/store/hooks', () => ({
	useAppDispatch: () => () => Promise.resolve(),
}));

describe('ProjectModalBase (simplified)', () => {
	const onSubmit = vi.fn(() => Promise.resolve());
	const onClose = vi.fn();

	function renderModal() {
		render(
			<ProjectModalBase
				title="Create"
				buttonLabel="Create"
				onClose={onClose}
				onSubmitAction={onSubmit}
				buildArgs={(name, width, height) => ({ name, width, height })}
				showInput
				showCanvasInputs={true}
			/>,
		);
	}

	it('shows error when name is empty', () => {
		renderModal();
		fireEvent.submit(screen.getByTestId('project-form'));
		expect(screen.getByText(PROJECT_MESSAGES.NAME_EMPTY)).toBeInTheDocument();
	});
	it('shows error when width > 4000', () => {
		renderModal();
		fireEvent.change(screen.getByTestId('project-input'), { target: { value: 'X' } });
		fireEvent.change(screen.getByTestId('canvas-width'), {
			target: { value: '9999' },
		});
		fireEvent.submit(screen.getByTestId('project-form'));
		expect(
			screen.getByText(PROJECT_MESSAGES.CANVAS_REQUIRED_WIDTH_MAX),
		).toBeInTheDocument();
	});

	it('shows error when width < 100', () => {
		renderModal();
		fireEvent.change(screen.getByTestId('project-input'), { target: { value: 'X' } });
		fireEvent.change(screen.getByTestId('canvas-width'), { target: { value: '50' } });
		fireEvent.submit(screen.getByTestId('project-form'));
		expect(
			screen.getByText(PROJECT_MESSAGES.CANVAS_REQUIRED_WIDTH_MIN),
		).toBeInTheDocument();
	});

	it('calls onSubmitAction on valid form', async () => {
		renderModal();
		fireEvent.change(screen.getByTestId('project-input'), {
			target: { value: 'OK' },
		});
		fireEvent.submit(screen.getByTestId('project-form'));

		await waitFor(() => expect(onSubmit).toHaveBeenCalled());
	});
});
