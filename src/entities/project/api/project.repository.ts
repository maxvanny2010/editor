import { db } from '@/shared/lib/db/dexie';
import type { Project } from '@/shared/types';

/**
 * The repository layer is responsible for all direct interactions with the database.
 * It abstracts the database logic from the rest of the application.
 * This version uses more efficient, built-in Dexie methods.
 */
export const projectRepository = {
	/** Retrieves all projects, sorted by the most recently updated. */
	getAll: (): Promise<Project[]> => {
		return db.projects.orderBy('updatedAt').reverse().toArray();
	},

	/** Retrieves a project by its unique ID. */
	getById: (id: string): Promise<Project | undefined> => {
		return db.projects.get(id);
	},

	/** Finds a single project with an exact, case-insensitive name match. */
	findByName: (name: string): Promise<Project | undefined> => {
		// Use Dexie's optimized method for case-insensitive exact matches.
		return db.projects.where('name').equalsIgnoreCase(name).first();
	},

	/** Adds a new project to the database. */
	add: (project: Project): Promise<string> => {
		return db.projects.add(project);
	},

	/** Updates a project's properties by its ID. */
	update: (id: string, updates: Partial<Project>): Promise<number> => {
		return db.projects.update(id, updates);
	},

	/** Removes a project from the database by its ID. */
	remove: (id: string): Promise<void> => {
		return db.projects.delete(id);
	},
};
