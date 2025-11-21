import { beforeEach, describe, expect, it } from 'vitest';
import { projectRepository } from '../project.repository';
import { nanoid } from 'nanoid';
import type { Project } from '@/shared/types';
import { db } from '@/shared/lib/db/dexie.ts';

describe('projectRepository', () => {
	beforeEach(async () => {
		await db.projects.clear();
	});

	it('add creates a record, and getById returns it', async () => {
		const now = Date.now();
		const project: Project = {
			id: '1',
			name: 'Alpha',
			width: 800,
			height: 600,
			createdAt: now,
			updatedAt: now,
		};

		await projectRepository.add(project);
		const found = await projectRepository.getById(project.id);

		expect(found).toEqual(project);
	});

	it('findByName finds a project by name, case-insensitively', async () => {
		const now = Date.now();
		const project: Project = {
			id: nanoid(),
			name: 'Case Test',
			width: 800,
			height: 600,
			createdAt: now,
			updatedAt: now,
		};
		await projectRepository.add(project);

		const found = await projectRepository.findByName('case test');

		expect(found).toBeDefined();
		expect(found?.name).toBe('Case Test');
	});

	it('getAll returns records sorted by updatedAt in descending order', async () => {
		const now = Date.now();
		const projectA: Project = {
			id: nanoid(),
			name: 'A',
			width: 800,
			height: 600,
			createdAt: now - 10,
			updatedAt: now - 10,
		};
		const projectB: Project = {
			id: nanoid(),
			name: 'B',
			width: 800,
			height: 600,
			createdAt: now,
			updatedAt: now,
		};

		await projectRepository.add(projectA);
		await projectRepository.add(projectB);

		const all = await projectRepository.getAll();
		expect(all.length).toBe(2);
		expect(all.map((p) => p.name)).toEqual(['B', 'A']);
	});

	it('update changes the name and updatedAt fields', async () => {
		const now = Date.now();
		const project: Project = {
			id: nanoid(),
			name: 'Old Name',
			width: 800,
			height: 600,
			createdAt: now,
			updatedAt: now,
		};
		await projectRepository.add(project);

		const newTimestamp = now + 10;
		await projectRepository.update(project.id, {
			name: 'New Name',
			updatedAt: newTimestamp,
		});

		const updated = await projectRepository.getById(project.id);
		expect(updated?.name).toBe('New Name');
		expect(updated?.updatedAt).toBe(newTimestamp);
	});

	it('remove successfully deletes a record', async () => {
		const now = Date.now();
		const project: Project = {
			id: nanoid(),
			name: 'To Delete',
			width: 800,
			height: 600,
			createdAt: now,
			updatedAt: now,
		};
		await projectRepository.add(project);

		await projectRepository.remove(project.id);
		const found = await projectRepository.getById(project.id);
		expect(found).toBeUndefined();
	});
});
