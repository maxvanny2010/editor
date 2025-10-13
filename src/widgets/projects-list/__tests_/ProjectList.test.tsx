import React from 'react';
import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';
import { ProjectList } from '../ProjectList';
import { renderWithStore } from '@/test-utils';
import { PROJECT_STATE } from '@/shared/constants';
import { screen, waitFor } from '@testing-library/react';
import { fetchProjects } from '@/entities/project/model';

vi.mock('@/entities/project/model/slice', async () => {
	const actual = await vi.importActual<typeof import('@/entities/project/model/slice')>(
		'@/entities/project/model/slice',
	);
	return { ...actual, fetchProjects: vi.fn(() => ({ type: 'projects/fetch' })) };
});

vi.mock('framer-motion', () => {
	type MotionDivProps = React.HTMLAttributes<HTMLDivElement> & {
		initial?: unknown;
		animate?: unknown;
		exit?: unknown;
		transition?: unknown;
	};

	const motion = {
		div: (props: MotionDivProps) => <div {...props} />,
	};

	const AnimatePresence = ({ children }: { children?: React.ReactNode }) => (
		<>{children}</>
	);

	return { motion, AnimatePresence };
});

vi.mock('@/shared/lib/hooks', () => ({
	useDelayedSkeleton: vi.fn(),
}));

const { useDelayedSkeleton } = await import('@/shared/lib/hooks');

describe('ProjectList UI states', () => {
	it('dispatches fetchProjects once on mount when empty and not loading', () => {
		(useDelayedSkeleton as Mock).mockReturnValue(false);

		renderWithStore(<ProjectList />, {
			initialState: {
				projects: {
					ids: [],
					entities: {},
					loading: PROJECT_STATE.IDLE,
					error: null,
				},
			},
		});

		expect(fetchProjects).toHaveBeenCalledTimes(1);
	});

	it('renders project cards when projects exist', () => {
		(useDelayedSkeleton as Mock).mockReturnValue(false);

		renderWithStore(<ProjectList />, {
			initialState: {
				projects: {
					ids: ['1'],
					entities: {
						'1': {
							id: '1',
							name: 'Test Project',
							createdAt: 1,
							updatedAt: 1,
						},
					},
					loading: PROJECT_STATE.SUCCEEDED,
					error: null,
				},
			},
		});

		expect(screen.getAllByTestId('project-card')).toHaveLength(1);
	});

	it('renders skeletons when loading', async () => {
		(useDelayedSkeleton as Mock).mockReturnValue(true);

		renderWithStore(<ProjectList />, {
			initialState: {
				projects: {
					ids: [],
					entities: {},
					loading: PROJECT_STATE.PENDING,
					error: null,
				},
			},
		});

		await waitFor(() => {
			expect(screen.getAllByTestId('skeleton')).toHaveLength(6);
		});
	});

	it('renders empty state when no projects and not loading', () => {
		(useDelayedSkeleton as Mock).mockReturnValue(false);

		renderWithStore(<ProjectList />, {
			initialState: {
				projects: {
					ids: [],
					entities: {},
					loading: PROJECT_STATE.IDLE,
					error: null,
				},
			},
		});

		expect(screen.getByTestId('empty-state')).toBeInTheDocument();
	});
});
