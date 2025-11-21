import { describe, expect, it } from 'vitest';
import { projectsSelectors } from '@/entities/project/model/selectors';
import type { RootState } from '@/store';
import type { ProjectsState } from '@/entities/project/model/slice';

describe('projectsSelectors', () => {
	it('selectActiveProject returns the correct project', () => {
		const mockProjects: ProjectsState = {
			ids: ['p1'],
			entities: {
				p1: {
					id: 'p1',
					name: 'Test',
					width: 800,
					height: 600,
					createdAt: 1,
					updatedAt: 2,
				},
			},
			loading: 'idle',
			error: null,
			activeId: 'p1',
		};

		const mockState = {
			projects: mockProjects,
		} as RootState;

		const project = projectsSelectors.selectActiveProject(mockState);
		expect(project?.id).toBe('p1');
		expect(project?.name).toBe('Test');
	});

	it('selectLoading returns the loading state', () => {
		const mockProjects: ProjectsState = {
			ids: [],
			entities: {},
			loading: 'pending',
			error: null,
			activeId: null,
		};

		const mockState = { projects: mockProjects } as RootState;
		const loading = projectsSelectors.selectLoading(mockState);
		expect(loading).toBe('pending');
	});
});
