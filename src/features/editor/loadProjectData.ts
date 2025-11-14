import { createAsyncThunk } from '@reduxjs/toolkit';
import { resetHistory } from '@/entities/history/model/slice';
import { loadHistoryFromDB } from '@/entities/history/model';
import { ensureInitialLayer } from '@/entities/layer/model';
import type { AppDispatch, RootState } from '@/store';
import { EDITOR_SLICE_ACTIONS } from '@/shared/constants';
import { applySnapshot } from '@/entities/history/lib';

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
