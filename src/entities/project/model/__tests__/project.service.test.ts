import { beforeEach, describe, expect, it } from 'vitest';
import { projectService } from '../project.service';
import { db } from '@/shared/lib/db/dexie.ts';

describe('projectService', () => {
	beforeEach(async () => {
		await db.projects.clear();
	});

	it('createProject: throws an error on empty name', async () => {
		await expect(projectService.createProject({ name: '   ' })).rejects.toThrow();
	});

	it('createProject: throws an error on duplicate name', async () => {
		await projectService.createProject({ name: 'Same' });
		await expect(projectService.createProject({ name: 'same' })).rejects.toThrow();
	});

	it('createProject: returns a valid Project on success', async () => {
		const p = await projectService.createProject({ name: 'Alpha' });
		expect(p.id).toBeTruthy();
		expect(p.name).toBe('Alpha');
		expect(typeof p.createdAt).toBe('number');
		expect(typeof p.updatedAt).toBe('number');
	});

	it('updateProject: returns the updated object and changes updatedAt', async () => {
		const p = await projectService.createProject({ name: 'Old' });

		// A small delay to ensure the timestamp will be different
		await new Promise((r) => setTimeout(r, 2));

		const upd = await projectService.updateProject({
			id: p.id,
			changes: { name: 'New' },
		});

		expect(upd.id).toBe(p.id);
		expect(upd.name).toBe('New');
		expect(upd.updatedAt).toBeGreaterThanOrEqual(p.updatedAt);
	});
});
