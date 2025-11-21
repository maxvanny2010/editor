import type { TypedStartListening } from '@reduxjs/toolkit';
import { loadProjectData } from '@/features/editor';
import type { AppDispatch, RootState } from '@/store';
import { setActiveProjectId } from './slice';
import { activeProjectService } from '@/entities/settings/model';

let currentLoadingProject: string | null = null;

export function setupProjectListeners(
	startListening: TypedStartListening<RootState, AppDispatch>,
): void {
	startListening({
		actionCreator: setActiveProjectId,
		effect: async (action, api) => {
			const projectId = action.payload;

			// No active project: reset state
			if (!projectId) {
				currentLoadingProject = null;
				return;
			}

			// Skip if restoreIntoEditor controls the flow
			if (activeProjectService.isRestoring()) return;

			// Prevent duplicate loads for the same project
			if (currentLoadingProject === projectId) return;

			currentLoadingProject = projectId;

			try {
				api.cancelActiveListeners?.();
				await api.dispatch(loadProjectData(projectId));
			} finally {
				currentLoadingProject = null;
			}
		},
	});
}
