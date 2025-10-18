import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '@/shared/lib/db/dexie.ts';
import { PROJECT_MESSAGES } from '@/shared/constants/projectMessages';
import { projectRepository } from '@/entities/project/api/project.repository.ts';
import { projectService } from '@/entities/project/model';

describe('projectService', () => {
	beforeEach(async () => {
		await db.projects.clear();
	});

	it('should throw an error if name is empty', async () => {
		await expect(projectService.createProject({ name: '   ' })).rejects.toThrow(
			PROJECT_MESSAGES.NAME_EMPTY,
		);
	});

	it('should throw an error if project name already exists', async () => {
		await projectService.createProject({ name: 'Same' });
		await expect(projectService.createProject({ name: 'same' })).rejects.toThrow(
			PROJECT_MESSAGES.NAME_DUPLICATE,
		);
	});

	it('should return a valid Project on success', async () => {
		const p = await projectService.createProject({ name: 'Alpha' });
		expect(p.id).toBeTruthy();
		expect(p.name).toBe('Alpha');
		expect(typeof p.createdAt).toBe('number');
		expect(typeof p.updatedAt).toBe('number');
	});

	it('should return updated project and change updatedAt', async () => {
		const p = await projectService.createProject({ name: 'Old' });
		await new Promise((r) => setTimeout(r, 2));

		const upd = await projectService.updateProject({
			id: p.id,
			changes: { name: 'New' },
		});

		expect(upd.id).toBe(p.id);
		expect(upd.name).toBe('New');
		expect(upd.updatedAt).toBeGreaterThanOrEqual(p.updatedAt);
	});

	it('should throw if project not found after update', async () => {
		const p = await projectService.createProject({ name: 'Lost' });
		const spy = vi
			.spyOn(projectRepository, 'getById')
			.mockResolvedValueOnce(undefined as never);

		await expect(
			projectService.updateProject({ id: p.id, changes: { name: 'Ghost' } }),
		).rejects.toThrow(PROJECT_MESSAGES.NOT_FOUND_AFTER_UPDATE);

		spy.mockRestore();
	});
});
