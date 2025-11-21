import { setActiveProjectId } from '@/entities/project/model/slice';
import { activeProjectRepository } from '@/entities/settings/api';
import { projectRepository } from '@/entities/project/api';
import { loadProjectData } from '@/features/editor';
import type { AppDispatch } from '@/store';

// Prevent parallel restore calls
let restorePromise: Promise<string | null> | null = null;

// Indicates when the restore process is running
let restoring = false;

export const activeProjectService = {
	/**
	 * Returns the current active project ID from storage.
	 */
	async getActiveProjectId() {
		return activeProjectRepository.get();
	},

	/**
	 * Sets the active project both in Dexie and Redux.
	 */
	async setActiveProject(dispatch: AppDispatch, projectId: string) {
		if (!projectId) return;
		await activeProjectRepository.set(projectId);
		dispatch(setActiveProjectId(projectId));
	},

	/**
	 * Clears the active project.
	 */
	async clearActiveProject(dispatch: AppDispatch) {
		await activeProjectRepository.clear();
		dispatch(setActiveProjectId(null));
	},

	/**
	 * True if a restore operation is currently running.
	 */
	isRestoring() {
		return restoring;
	},

	/**
	 * Restores a project into the editor:
	 * - projectId from URL has priority
	 * - validates project exists in Dexie
	 * - loads layers, viewport, history
	 * - persists project as active if restored via URL
	 *
	 * Prevents parallel restore calls.
	 */
	async restoreIntoEditor(
		dispatch: AppDispatch,
		projectIdFromUrl?: string,
	): Promise<string | null> {
		// If restore is already in progress, return same promise
		if (restorePromise) return restorePromise;

		restorePromise = (async () => {
			restoring = true;

			try {
				const projectId = projectIdFromUrl || (await this.getActiveProjectId());

				if (!projectId) return null;

				const exists = await projectRepository.exists(projectId);
				if (!exists) {
					if (!projectIdFromUrl) {
						await this.clearActiveProject(dispatch);
					}
					return null;
				}

				// Set active project in Redux state
				dispatch(setActiveProjectId(projectId));

				// Load layers, history, viewport, etc.
				await dispatch(loadProjectData(projectId)).unwrap();

				// If restore was triggered by URL — persist this project as active
				if (projectIdFromUrl) {
					await activeProjectRepository.set(projectId);
				}

				return projectId;
			} finally {
				restorePromise = null;
				restoring = false;
			}
		})();

		return restorePromise;
	},
};
