import { beforeEach, describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
	createProject,
	deleteProject,
	fetchProjects,
	makeSelectors,
	projectsReducer,
	updateProject,
} from '../slice';
import { projectRepository } from '../../api/project.repository';
import { nanoid } from 'nanoid';
import type { Project } from '@/shared/types';
import { db } from '@/shared/lib/db/dexie.ts';

type Root = ReturnType<ReturnType<typeof storeFactory>['getState']>;

const storeFactory = () =>
	configureStore({
		reducer: { projects: projectsReducer },
	});

const selectorsFactory = () => makeSelectors<Root>((s) => s.projects);

describe('projectsSlice + thunks', () => {
	beforeEach(async () => {
		await db.projects.clear();
	});

	it('fetchProjects populates state from IndexedDB', async () => {
		const now = Date.now();
		const records: Project[] = [
			{ id: nanoid(), name: 'A', createdAt: now - 2, updatedAt: now - 2 },
			{ id: nanoid(), name: 'B', createdAt: now - 1, updatedAt: now - 1 },
		];
		for (const r of records) await projectRepository.add(r);

		const store = storeFactory();
		const selectors = selectorsFactory();

		await store.dispatch(fetchProjects());
		const all = selectors.selectAll(store.getState());
		expect(all.length).toBe(2);
		expect(all.map((x) => x.name)).toEqual(['B', 'A']);
	});

	it('createProject adds a project to the state', async () => {
		const store = storeFactory();
		const selectors = selectorsFactory();

		await store.dispatch(createProject({ name: 'Demo' }));

		const all = selectors.selectAll(store.getState());
		expect(all.length).toBe(1);
		expect(all[0]?.name).toBe('Demo');
	});

	it('updateProject updates a project', async () => {
		const store = storeFactory();
		const selectors = selectorsFactory();

		const createRes = await store.dispatch(createProject({ name: 'X' })).unwrap();
		await store.dispatch(updateProject({ id: createRes.id, changes: { name: 'Y' } }));

		const byId = selectors.selectById(store.getState(), createRes.id);
		expect(byId?.name).toBe('Y');
	});

	it('deleteProject removes a project', async () => {
		const store = storeFactory();
		const selectors = selectorsFactory();

		const p = await store.dispatch(createProject({ name: 'ToDelete' })).unwrap();
		await store.dispatch(deleteProject(p.id));

		const exists = selectors.selectById(store.getState(), p.id);
		expect(exists).toBeUndefined();
	});

	it('selectByName filters by name, case-insensitively', async () => {
		const store = storeFactory();
		const selectors = selectorsFactory();

		await store.dispatch(createProject({ name: 'My Project' }));
		await store.dispatch(createProject({ name: 'Another' }));

		const filtered = selectors.selectByName(store.getState(), 'project');
		expect(filtered.map((x) => x.name)).toEqual(['My Project']);
	});
});
