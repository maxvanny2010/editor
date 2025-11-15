import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@/store';
import { resetHistory } from '@/entities/history/model/slice';
import { loadHistoryFromDB } from '@/entities/history/model';
import { ensureInitialLayer } from '@/entities/layer/model';
import { projectRepository } from '@/entities/project/api';
import { upsertProject } from '@/entities/project/model';
import { applySnapshot } from '@/entities/history/lib';
import { EDITOR_SLICE_ACTIONS, PROJECT_MESSAGES } from '@/shared/constants';

/**
 *  Clean project load with full state reset.
 **/
export const loadProjectData = createAsyncThunk<
	void,
	string,
	{ state: RootState; dispatch: AppDispatch }
>(
	`${EDITOR_SLICE_ACTIONS.LOAD_PROJECT_DATA}`,
	async (projectId, { dispatch, getState }) => {
		const project = await projectRepository.getById(projectId);
		if (!project) {
			throw new Error(`${PROJECT_MESSAGES.ERROR_PROJECT_NOT_FOUND(projectId)}`);
		}

		dispatch(upsertProject(project));

		// 1) clear old undo/redo
		dispatch(resetHistory());

		// 2) ensure base layer exists
		await dispatch(ensureInitialLayer(projectId)).unwrap();

		// 3) load history stack from Dexie
		await dispatch(loadHistoryFromDB(projectId)).unwrap();

		// 4) restore last snapshot (this is what restores the CANVAS)
		const state = getState();
		const entries = state.history.stack;

		if (entries.length > 0) {
			const last = entries[entries.length - 1];

			if (last?.state) {
				await applySnapshot(last.state, { dispatch, getState });
			}
		}
	},
);
