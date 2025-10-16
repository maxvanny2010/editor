import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithStore } from '@/test-utils';
import { ProjectModalBase } from '../ProjectModalBase';
import { PROJECT_MESSAGES } from '@/shared/constants';
import { vi } from 'vitest';

describe('ProjectModalBase', () => {
	const onSubmitAction = vi.fn();
	const onClose = vi.fn();

	async function renderModal() {
		return renderWithStore(
			<ProjectModalBase
				title="Test Modal"
				buttonLabel="Create"
				onClose={onClose}
				onSubmitAction={onSubmitAction}
				buildArgs={(name) => ({ name })}
			/>,
		);
	}

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('shows validation error when input is empty', async () => {
		await renderModal();
		fireEvent.click(await screen.findByTestId('project-submit'));
		expect(await screen.findByText(PROJECT_MESSAGES.EMPTY_NAME)).toBeInTheDocument();
	});

	it('handles successful submit', async () => {
		await renderModal();
		fireEvent.change(await screen.findByTestId('project-input'), {
			target: { value: 'Alpha' },
		});
		fireEvent.click(await screen.findByTestId('project-submit'));

		await waitFor(() => expect(onSubmitAction).toHaveBeenCalled());
		expect(onClose).toHaveBeenCalled();
	});

	it('handles duplicate name error', async () => {
		onSubmitAction.mockRejectedValueOnce(new Error('exists'));

		await renderModal();
		fireEvent.change(await screen.findByTestId('project-input'), {
			target: { value: 'exists' },
		});
		fireEvent.click(await screen.findByTestId('project-submit'));

		expect(
			await screen.findByText(PROJECT_MESSAGES.DUPLICATE_NAME),
		).toBeInTheDocument();
	});

	it('handles generic server error', async () => {
		onSubmitAction.mockRejectedValueOnce(new Error('server error'));

		await renderModal();
		fireEvent.change(await screen.findByTestId('project-input'), {
			target: { value: 'Oops' },
		});
		fireEvent.click(await screen.findByTestId('project-submit'));

		expect(
			await screen.findByText(PROJECT_MESSAGES.UNEXPECTED_SERVER_ERROR),
		).toBeInTheDocument();
	});
	it('closes modal when Cancel is clicked', async () => {
		await renderModal();
		fireEvent.click(await screen.findByRole('button', { name: /cancel/i }));
		expect(onClose).toHaveBeenCalled();
	});
});
