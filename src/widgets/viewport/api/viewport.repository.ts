import { db } from '@/shared/lib/db';
import type { ProjectViewState } from '@/shared/types';

/**
 * Simple repository for saving / loading the viewport state per project.
 */
export const ViewportRepository = {
	async get(projectId: string): Promise<ProjectViewState | undefined> {
		return db.table<ProjectViewState>('viewStates').get(projectId);
	},

	async save(state: ProjectViewState): Promise<void> {
		await db.table<ProjectViewState>('viewStates').put(state);
	},
};
