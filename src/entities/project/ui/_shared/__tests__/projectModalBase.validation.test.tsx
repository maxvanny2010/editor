import { fireEvent, screen } from '@testing-library/react';
import { ProjectModalBase } from '../ProjectModalBase';
import { PROJECT_MESSAGES } from '@/shared/constants';
import { renderWithStore } from '@/test-utils';
import { vi } from 'vitest';

describe('ProjectModalBase validation', () => {
	it('shows error when input is empty', async () => {
		const onClose = vi.fn();
		const onSubmitAction = vi.fn();

		renderWithStore(
			<ProjectModalBase
				title="Test Modal"
				buttonLabel="Create"
				onClose={onClose}
				onSubmitAction={onSubmitAction}
				buildArgs={(name) => ({ name })}
			/>,
		);

		fireEvent.submit(screen.getByTestId('project-form'));

		expect(await screen.findByRole('alert')).toHaveTextContent(
			PROJECT_MESSAGES.NAME_EMPTY,
		);
	});

	it('shows error if name exceeds 25 characters', async () => {
		const onClose = vi.fn();
		const onSubmitAction = vi.fn();

		renderWithStore(
			<ProjectModalBase
				title="Test Modal"
				buttonLabel="Create"
				onClose={onClose}
				onSubmitAction={onSubmitAction}
				buildArgs={(name) => ({ name })}
			/>,
		);

		const input = screen.getByTestId('project-input');
		fireEvent.change(input, { target: { value: 'A'.repeat(26) } });
		fireEvent.submit(screen.getByTestId('project-form'));

		expect(await screen.findByRole('alert')).toHaveTextContent(
			PROJECT_MESSAGES.NAME_REQUEST,
		);
	});
});
