import Dexie, { type Table } from 'dexie';
import type { Project } from '@/shared/types';

/**
 * Dexie database setup.
 * This class defines the database schema and tables.
 * The `Project` type is declared globally in `src/types.d.ts`.
 */
class ProjectDatabase extends Dexie {
	public projects!: Table<Project, string>;

	public constructor() {
		super('ProjectDatabase'); // Database name
		this.version(1).stores({
			projects: 'id, name, createdAt, updatedAt',
		});
		this.projects = this.table('projects');
	}
}

// Export a singleton instance of the database
export const db = new ProjectDatabase();
