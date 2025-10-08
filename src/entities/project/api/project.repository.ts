// src/entities/project/api/project.repository.ts
import { db } from '@/shared/lib/db/dexie';
import type { Project } from '@/shared/types';

export const projectRepository = {
	async getAll(): Promise<Project[]> {
		return db.projects.orderBy('updatedAt').reverse().toArray();
	},
	async getById(id: string): Promise<Project | undefined> {
		return db.projects.get(id);
	},
	async findByName(name: string): Promise<Project | undefined> {
		return db.projects.where('name').equalsIgnoreCase(name).first();
	},
	async add(project: Project): Promise<string> {
		return db.projects.add(project);
	},
	async update(id: string, updates: Partial<Project>): Promise<number> {
		return db.projects.update(id, updates);
	},
	async remove(id: string): Promise<void> {
		return db.projects.delete(id);
	},
};
