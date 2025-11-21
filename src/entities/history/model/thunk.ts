import { nanoid } from 'nanoid';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { HistoryEntry } from '@/shared/types';
import type { AppDispatch, RootState } from '@/store';
import { applySnapshot } from '@/entities/history/lib';
import { historyService } from '@/entities/history/model';
import { pushState, resetHistory, setPreview } from './slice';
import { HISTORY_SLICE_ACTIONS, ICON_KEYS, UI_LABELS } from '@/shared/constants';

export const loadHistoryFromDB = createAsyncThunk<void, string, { state: RootState }>(
	`${HISTORY_SLICE_ACTIONS.LOAD_HISTORY_FROM_DB}`,
	async (_, { dispatch, getState }) => {
		const state = getState() as RootState;
		const projectId = state.projects.activeId;
		if (!projectId) return;

		const entries = await historyService.loadByProject(projectId);

		dispatch(resetHistory());

		for (const entry of entries as HistoryEntry[]) {
			const isDrawAction = !!entry.toolType; // brush/line/shape/eraser

			const normalizedIcon = isDrawAction
				? entry.icon
				: (entry.icon ?? ICON_KEYS.EDIT);

			const normalized: HistoryEntry = {
				...entry,
				icon: normalizedIcon,
			};

			dispatch(pushState(normalized));
		}
	},
);

export const applyCurrentSnapshot = createAsyncThunk<
	void,
	void,
	{ state: RootState; dispatch: AppDispatch }
>(`${HISTORY_SLICE_ACTIONS.APPLY_SNAPSHOT}`, async (_, { dispatch, getState }) => {
	const { history } = getState();
	const entry = history.stack[history.currentIndex];
	if (!entry) return;

	const projectId = entry.state.projectId;

	//  apply snapshot (Redux + Dexie + Canvas)
	await applySnapshot(entry.state, { dispatch, getState });

	// remove history after a chosen step
	await historyService.deleteAfterIndex(projectId, history.currentIndex);

	// recollect history
	dispatch(resetHistory());
	const newHistory = history.stack.slice(0, history.currentIndex + 1);

	for (const e of newHistory) {
		dispatch(pushState(e));
		await historyService.saveEntry(e);
	}

	// add final step "Apply snapshot"
	const appliedEntry = {
		id: nanoid(),
		label: UI_LABELS.APPLY_SNAPSHOT,
		state: entry.state,
		timestamp: Date.now(),
		icon: 'edit',
	};

	dispatch(pushState(appliedEntry));
	await historyService.saveEntry(appliedEntry);

	// exit from preview mode
	dispatch(setPreview(false));
});
