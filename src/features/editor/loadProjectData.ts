import { createAsyncThunk } from '@reduxjs/toolkit';
import { resetHistory } from '@/entities/history/model/slice';
import { loadHistoryFromDB } from '@/entities/history/model';
import { ensureInitialLayer } from '@/entities/layer/model';
import type { AppDispatch, RootState } from '@/store';
import { EDITOR_SLICE_ACTIONS } from '@/shared/constants';

/**
 *  Clean project load with full state reset.
 **/
export const loadProjectData = createAsyncThunk<
	void,
	string,
	{ state: RootState; dispatch: AppDispatch }
>(`${EDITOR_SLICE_ACTIONS.LOAD_PROJECT_DATA}`, async (projectId, { dispatch }) => {
	dispatch(resetHistory());
	await dispatch(ensureInitialLayer(projectId)).unwrap();
	await dispatch(loadHistoryFromDB(projectId)).unwrap();
});
