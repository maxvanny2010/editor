import type { TypedStartListening } from '@reduxjs/toolkit';
import { loadProjectData } from '@/features/editor';
import type { AppDispatch, RootState } from '@/store';
import { setActiveProjectId } from './slice';

export function setupProjectListeners(
	startListening: TypedStartListening<RootState, AppDispatch>,
): void {
	startListening({
		actionCreator: setActiveProjectId,
		effect: async (action, api) => {
			const projectId = action.payload;
			if (!projectId) return;

			api.cancelActiveListeners?.();
			await api.dispatch(loadProjectData(projectId));
		},
	});
}
