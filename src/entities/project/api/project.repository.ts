import type { Project } from '@/shared/types';
import { projectTable } from './project.db';

/**
 * Repository layer for project entity.
 * Performs CRUD operations on the Dexie table.
 */
export const projectRepository = {
	async getAll(): Promise<Project[]> {
		return projectTable.toArray();
	},

	async getById(id: string): Promise<Project | undefined> {
		return projectTable.get(id);
	},

	async findByName(name: string): Promise<Project | undefined> {
		return projectTable.where('name').equalsIgnoreCase(name).first();
	},

	async add(project: Project): Promise<void> {
		await projectTable.add(project);
	},

	async update(id: string, changes: Partial<Project>): Promise<void> {
		await projectTable.update(id, changes);
	},

	async remove(id: string): Promise<void> {
		await projectTable.delete(id);
	},
};
