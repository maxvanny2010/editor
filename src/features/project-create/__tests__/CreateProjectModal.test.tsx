import React from 'react';
import { describe, it, expect, vi, type Mock } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CreateProjectModal } from '../model';
import { PROJECT_MESSAGES } from '@/shared/constants';
import { TestStoreProvider } from '@/test-utils';
import { createProject } from '@/entities/project/model';

vi.mock('framer-motion', () => {
	type MotionFormProps = React.HTMLAttributes<HTMLFormElement> & {
		initial?: unknown;
		animate?: unknown;
		exit?: unknown;
		transition?: unknown;
	};

	const motion = {
		form: (props: MotionFormProps) => <form {...props} />,
		div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
	};

	const AnimatePresence = ({ children }: { children?: React.ReactNode }) => (
		<>{children}</>
	);

	return { motion, AnimatePresence };
});

vi.mock('@/entities/project/model', async () => {
	const actual = await vi.importActual<typeof import('@/entities/project/model')>(
		'@/entities/project/model',
	);
	return { ...actual, createProject: vi.fn() };
});

describe('CreateProjectModal', () => {
	const mockAction = createProject as unknown as Mock;
	const renderModal = () =>
		render(
			<TestStoreProvider>
				<CreateProjectModal onClose={vi.fn()} />
			</TestStoreProvider>,
		);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders input and buttons', () => {
		renderModal();
		expect(screen.getByPlaceholderText('Project name')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
	});

	it('shows validation error when input is empty', async () => {
		renderModal();
		fireEvent.click(screen.getByRole('button', { name: /create/i }));

		await waitFor(() =>
			expect(screen.getByText(PROJECT_MESSAGES.EMPTY_NAME)).toBeInTheDocument(),
		);
		expect(mockAction).not.toHaveBeenCalled();
	});

	it('dispatches createProject with valid name', async () => {
		const unwrap = vi.fn().mockResolvedValue({
			id: '1',
			name: 'Valid',
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
		mockAction.mockReturnValue(() => ({ unwrap }));

		renderModal();
		const input = screen.getByPlaceholderText('Project name');
		fireEvent.change(input, { target: { value: 'Valid' } });
		fireEvent.click(screen.getByRole('button', { name: /create/i }));

		await waitFor(() => {
			expect(mockAction).toHaveBeenCalledWith({ name: 'Valid' });
			expect(unwrap).toHaveBeenCalled();
		});
	});

	it('shows duplicate name error when rejected', async () => {
		const unwrap = vi
			.fn()
			.mockRejectedValue(new Error(PROJECT_MESSAGES.DUPLICATE_NAME));
		mockAction.mockReturnValue(() => ({ unwrap }));

		renderModal();
		const input = screen.getByPlaceholderText('Project name');
		fireEvent.change(input, { target: { value: 'Duplicate' } });
		fireEvent.click(screen.getByRole('button', { name: /create/i }));

		await waitFor(() =>
			expect(screen.getByText(PROJECT_MESSAGES.DUPLICATE_NAME)).toBeInTheDocument(),
		);
	});

	it('shows generic error for unknown rejection', async () => {
		const unwrap = vi.fn().mockRejectedValue(new Error('Unexpected server error'));
		mockAction.mockReturnValue(() => ({ unwrap }));

		renderModal();
		const input = screen.getByPlaceholderText('Project name');
		fireEvent.change(input, { target: { value: 'Crash' } });
		fireEvent.click(screen.getByRole('button', { name: /create/i }));

		await waitFor(() =>
			expect(screen.getByText('Unexpected server error')).toBeInTheDocument(),
		);
	});
});
