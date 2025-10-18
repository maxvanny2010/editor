import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, type Mock, vi } from 'vitest';
import { renderWithStore } from '@/test-utils';
import { projectsAdapter } from '@/entities/project/model';
import { PROJECT_STATE } from '@/shared/constants';
import { ProjectList } from '../ProjectList';

// cancel a global mock ProjectModalBase
vi.unmock('@/entities/project/ui/_shared');

let useDelayedSkeleton: Mock;

describe('ProjectList — UI States', () => {
	beforeAll(async () => {
		vi.mock('@/shared/lib/hooks', () => ({ useDelayedSkeleton: vi.fn() }));
		const hooks = await import('@/shared/lib/hooks');
		useDelayedSkeleton = hooks.useDelayedSkeleton as Mock;
	});

	afterEach(() => vi.restoreAllMocks());

	it('renders project cards when projects exist', async () => {
		useDelayedSkeleton.mockReturnValue(false);

		const projectsState = projectsAdapter.addOne(
			projectsAdapter.getInitialState({
				loading: PROJECT_STATE.SUCCEEDED,
				error: null,
			}),
			{
				id: '1',
				name: 'Test Project',
				width: 800,
				height: 600,
				createdAt: 1,
				updatedAt: 1,
			},
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

	it('renders UpdateProjectModal when "Update" button is clicked', async () => {
		useDelayedSkeleton.mockReturnValue(false);

		const projectsState = projectsAdapter.addOne(
			projectsAdapter.getInitialState({
				loading: PROJECT_STATE.SUCCEEDED,
				error: null,
			}),
			{
				id: '1',
				name: 'Editable Project',
				width: 1024,
				height: 768,
				createdAt: 1,
				updatedAt: 1,
			},
		);

		renderWithStore(<ProjectList />, { initialState: { projects: projectsState } });

		fireEvent.click(screen.getByTestId('update-button-1'));

		await waitFor(() =>
			expect(screen.getByTestId('update-modal')).toBeInTheDocument(),
		);
	});

	it('renders DeleteProjectModal when "Delete" button is clicked', async () => {
		useDelayedSkeleton.mockReturnValue(false);

		const projectsState = projectsAdapter.addOne(
			projectsAdapter.getInitialState({
				loading: PROJECT_STATE.SUCCEEDED,
				error: null,
			}),
			{
				id: '1',
				name: 'Deletable Project',
				width: 1200,
				height: 800,
				createdAt: 1,
				updatedAt: 1,
			},
		);

		renderWithStore(<ProjectList />, { initialState: { projects: projectsState } });

		fireEvent.click(screen.getByTestId('delete-button-1'));

		await waitFor(() =>
			expect(screen.getByTestId('delete-modal')).toBeInTheDocument(),
		);
	});

	it('does not render skeletons or empty state when delayedSkeleton is false but loading is pending', async () => {
		useDelayedSkeleton.mockReturnValue(false);

		const projectsState = projectsAdapter.getInitialState({
			loading: PROJECT_STATE.PENDING,
			error: null,
		});

		renderWithStore(<ProjectList />, { initialState: { projects: projectsState } });

		await waitFor(() => {
			expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
			expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
		});
	});

	it('renders existing project when loading is IDLE (non-empty state)', async () => {
		useDelayedSkeleton.mockReturnValue(false);

		const projectsState = projectsAdapter.addOne(
			projectsAdapter.getInitialState({
				loading: PROJECT_STATE.IDLE,
				error: null,
			}),
			{
				id: '99',
				name: 'Idle Project',
				width: 640,
				height: 480,
				createdAt: 1,
				updatedAt: 1,
			},
		);

		renderWithStore(<ProjectList />, { initialState: { projects: projectsState } });

		await waitFor(() => {
			expect(screen.getByTestId('project-card')).toBeInTheDocument();
		});
	});
});
