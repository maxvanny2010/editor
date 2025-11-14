import { beforeEach, describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
	createProject,
	deleteProject,
	fetchProjects,
	projectsReducer,
	updateProject,
} from '../slice';
import { nanoid } from 'nanoid';
import { db } from '@/shared/lib/db';
import type { Project } from '@/shared/types';
import { makeSelectors } from '@/shared/lib/store';
import { projectRepository } from '@/entities/project/api';
import { projectService } from '@/entities/project/model';

const storeFactory = () =>
	configureStore({
		reducer: { projects: projectsReducer },
	});

type TestRootState = ReturnType<ReturnType<typeof storeFactory>['getState']>;

const selectors = makeSelectors<TestRootState, Project>((s) => s.projects);

describe('projectsSlice + thunks', () => {
	beforeEach(async () => {
		await db.projects.clear();
	});

	it('fetchProjects populates state from IndexedDB', async () => {
		const now = Date.now();
		const records: Project[] = [
			{
				id: nanoid(),
				name: 'A',
				width: 800,
				height: 600,
				createdAt: now - 2,
				updatedAt: now - 2,
			},
			{
				id: nanoid(),
				name: 'B',
				width: 800,
				height: 600,
				createdAt: now - 1,
				updatedAt: now - 1,
			},
		];

		for (const r of records) await projectRepository.add(r);

		const store = storeFactory();

		await store.dispatch(fetchProjects());
		const all = selectors.selectAll(store.getState());

		expect(all.length).toBe(2);
		expect(all.map((x) => x.name)).toEqual(['B', 'A']);
	});

	it('createProject adds a project to the state', async () => {
		const store = storeFactory();

		await store.dispatch(createProject({ name: 'Demo' }));

		const all = selectors.selectAll(store.getState());
		expect(all.length).toBe(1);
		expect(all[0]?.name).toBe('Demo');
	});

	it('updateProject updates a project', async () => {
		const store = storeFactory();

		const createRes = await store.dispatch(createProject({ name: 'X' })).unwrap();
		await store.dispatch(updateProject({ id: createRes.id, changes: { name: 'Y' } }));

		const byId = selectors.selectById(store.getState(), createRes.id);
		expect(byId?.name).toBe('Y');
	});

	it('deleteProject removes a project', async () => {
		const id = 'test-id-123';

		const mockFn = vi
			.spyOn(projectService, 'deleteWithRelations')
			.mockResolvedValue(id);

		const dispatch = vi.fn();
		const getState = vi.fn();

		const result = await deleteProject(id)(dispatch, getState, undefined);

		expect(result.type).toMatch(/fulfilled$/);
		expect(result.payload).toBe(id);

		mockFn.mockRestore();
	});

	it('selectByName filters by name, case-insensitively', async () => {
		const store = storeFactory();

		await store.dispatch(createProject({ name: 'My Project' }));
		await store.dispatch(createProject({ name: 'Another' }));

		const filtered = selectors.selectByName(store.getState(), 'project');
		expect(filtered.map((x) => x.name)).toEqual(['My Project']);
	});
});
