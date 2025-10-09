import Dexie, { type Table } from 'dexie';
import type { Project } from '@/shared/types';

export class EditorDB extends Dexie {
	projects!: Table<Project, string>;

	constructor() {
		super('EditorDB');

		// Version 1: the table of projects
		this.version(1).stores({
			projects: 'id, name, createdAt, updatedAt',
		});
	}
}

export const db = new EditorDB();
