import Dexie, { type Table } from 'dexie';
import type { Project } from '@/shared/types';

export class EditorDB extends Dexie {
	projects!: Table<Project, string>;

	public constructor() {
		super('EditorDB');
		this.version(1).stores({
			projects: 'id, name, createdAt, updatedAt',
		});
		this.projects = this.table('projects');
	}
}

export const db = new EditorDB();
