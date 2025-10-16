import { fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, type Mock, vi } from 'vitest';
import { renderWithStore } from '@/test-utils';
import { ProjectList } from '../ProjectList';
import { projectsAdapter } from '@/entities/project/model';
import { PROJECT_STATE } from '@/shared/constants';

let useDelayedSkeleton: Mock;

describe('ProjectList — UI States', () => {
	beforeAll(async () => {
		vi.mock('@/shared/lib/hooks', () => ({ useDelayedSkeleton: vi.fn() }));
		const hooks = await import('@/shared/lib/hooks');
		useDelayedSkeleton = hooks.useDelayedSkeleton as Mock;
	});

	afterEach(() => vi.clearAllMocks());

	it('renders project cards when projects exist', async () => {
		useDelayedSkeleton.mockReturnValue(false);

		const projectsState = projectsAdapter.addOne(
			projectsAdapter.getInitialState({
				loading: PROJECT_STATE.SUCCEEDED,
				error: null,
			}),
			{ id: '1', name: 'Test Project', createdAt: 1, updatedAt: 1 },
		);

		renderWithStore(<ProjectList />, { initialState: { projects: projectsState } });

		await waitFor(() =>
			expect(screen.getAllByTestId('project-card')).toHaveLength(1),
		);
	});

	it('renders skeletons when loading', async () => {
		useDelayedSkeleton.mockReturnValue(true);

		const projectsState = projectsAdapter.getInitialState({
			loading: PROJECT_STATE.PENDING,
			error: null,
		});

		renderWithStore(<ProjectList />, { initialState: { projects: projectsState } });

		await waitFor(() => expect(screen.getAllByTestId('skeleton')).toHaveLength(12));
	});

	it('renders empty state when no projects and not loading', async () => {
		useDelayedSkeleton.mockReturnValue(false);

		const projectsState = projectsAdapter.getInitialState({
			loading: PROJECT_STATE.IDLE,
			error: null,
		});

		renderWithStore(<ProjectList />, { initialState: { projects: projectsState } });

		await waitFor(() =>
			expect(screen.getByTestId('empty-state')).toBeInTheDocument(),
		);
	});

	it('closes the UpdateProjectModal when onClose is triggered', async () => {
		useDelayedSkeleton.mockReturnValue(false);

		const project = { id: '1', name: 'Alpha', createdAt: 1, updatedAt: 1 };
		const projectsState = {
			ids: [project.id],
			entities: { [project.id]: project },
			loading: PROJECT_STATE.SUCCEEDED,
			error: null,
		};

		renderWithStore(<ProjectList />, { initialState: { projects: projectsState } });

		fireEvent.click(await screen.findByTestId('update-button-1'));
		expect(await screen.findByRole('dialog')).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});
});
