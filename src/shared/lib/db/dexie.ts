import Dexie, { type Table } from 'dexie';
import type {
	ActiveProject,
	HistoryEntry,
	Layer,
	Project,
	ProjectViewState,
} from '@/shared/types';

/**
 * Dexie database for the React Editor.
 * Contains projects, layers, viewport states, and history entries.
 */
type LegacyProject = Omit<Project, 'width' | 'height'> &
	Partial<Pick<Project, 'width' | 'height'>>;

export class EditorDB extends Dexie {
	projects!: Table<Project, string>;
	layers!: Table<Layer, string>;
	viewStates!: Table<ProjectViewState, string>;
	history!: Table<HistoryEntry, string>;
	activeProject: Table<ActiveProject, string>;

	constructor() {
		super('EditorDB');

		// ─── Version 1 — initial projects table ─────────────────────────────
		this.version(1).stores({
			projects: 'id, name, createdAt, updatedAt',
		});

		// ─── Version 2 — added width and height to projects ─────────────────
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

		// ─── Version 3 — added layers table ─────────────────────────────────
		this.version(3).stores({
			layers: 'id, projectId, name, zIndex, visible, opacity, createdAt, updatedAt, snapshot',
		});

		// ─── Version 4 — added viewport states ──────────────────────────────
		this.version(4).stores({
			viewStates: 'projectId',
		});

		// ─── Version 5 — corrected history table ─────────────────────────────
		this.version(5).stores({
			history: 'id, timestamp, state.projectId',
		});
		// ─── Version 6 — active project table ──────────────────────────────
		this.version(6).stores({
			activeProject: 'id, projectId',
		});

		this.projects = this.table('projects');
		this.layers = this.table('layers');
		this.viewStates = this.table('viewStates');
		this.history = this.table('history');
		this.activeProject = this.table('activeProject');
	}
}

export const db = new EditorDB();
