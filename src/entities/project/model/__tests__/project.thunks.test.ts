import { describe, expect, it, vi } from 'vitest';
import { createProjectThunk, deleteProjectThunk, fetchProjects } from '../thunks';
import { projectService } from '../project.service';
import { makeTestStore } from '@/test-utils/testStore';

vi.mock('../project.service', () => ({
	projectService: {
		getProjects: vi.fn(() => Promise.resolve([{ id: '1', name: 'Project A' }])),
		createProject: vi.fn((data) => Promise.resolve({ id: '2', name: data.name })),
		deleteProject: vi.fn(() => Promise.resolve()),
	},
}));

describe('Project thunks', () => {
	const store = makeTestStore();

	it('fetchProjects should call projectService.getProjects', async () => {
		await store.dispatch(fetchProjects());
		expect(projectService.getProjects).toHaveBeenCalled();
	});

	it('createProjectThunk should call projectService.createProject', async () => {
		await store.dispatch(createProjectThunk({ name: 'New Project' }));
		expect(projectService.createProject).toHaveBeenCalledWith({
			name: 'New Project',
		});
	});

	it('deleteProjectThunk should call projectService.deleteProject', async () => {
		await store.dispatch(deleteProjectThunk('project-1'));
		expect(projectService.deleteProject).toHaveBeenCalledWith('project-1');
	});
});
