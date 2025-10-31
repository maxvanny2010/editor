import Dexie, { type Table } from 'dexie';
import type { Layer, Project, ProjectViewState } from '@/shared/types';

type LegacyProject = Omit<Project, 'width' | 'height'> &
	Partial<Pick<Project, 'width' | 'height'>>;

export class EditorDB extends Dexie {
	projects!: Table<Project, string>;
	layers!: Table<Layer, string>;
	viewStates!: Table<ProjectViewState, string>;

	constructor() {
		super('EditorDB');

		this.version(1).stores({
			projects: 'id, name, createdAt, updatedAt',
		});

		this.version(2)
			.stores({
				projects: 'id, name, width, height, createdAt, updatedAt',
			})
			.upgrade(async (tx) => {
				const table = tx.table<LegacyProject, string>('projects');
				await table.toCollection().modify((project) => {
					if (project.width === undefined) project.width = 800;
					if (project.height === undefined) project.height = 600;
				});
			});

		this.version(3).stores({
			layers: 'id, projectId, name, zIndex, visible, opacity, createdAt, updatedAt, snapshot',
		});

		this.version(4).stores({
			viewStates: 'projectId',
		});

		this.projects = this.table('projects');
		this.layers = this.table('layers');
		this.viewStates = this.table('viewStates');
	}
}

export const db = new EditorDB();
