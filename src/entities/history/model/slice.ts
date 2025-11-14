import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { HistoryEntry, HistoryState } from '@/shared/types';
import { NAMES } from '@/shared/constants';

const initialState: HistoryState = {
	stack: [],
	currentIndex: -1,
	isPreview: false,
};

const slice = createSlice({
	name: `${NAMES.HISTORY}`,
	initialState,
	reducers: {
		pushState(state, action: PayloadAction<HistoryEntry>) {
			state.stack = [
				...state.stack.slice(0, state.currentIndex + 1),
				action.payload,
			];
			state.currentIndex = state.stack.length - 1;
			state.isPreview = false;
		},

		undo(state) {
			if (state.currentIndex > 0) state.currentIndex--;
			state.isPreview = true;
		},
		redo(state) {
			if (state.currentIndex < state.stack.length - 1) state.currentIndex++;
			state.isPreview = true;
		},
		jumpTo(state, action: PayloadAction<number>) {
			const i = action.payload;
			if (i >= 0 && i < state.stack.length) {
				state.currentIndex = i;
				state.isPreview = true;
			}
		},
		setPreview(state, action: PayloadAction<boolean>) {
			state.isPreview = action.payload;
		},

		resetHistory() {
			return initialState;
		},
	},
});

export const { pushState, undo, redo, jumpTo, resetHistory, setPreview } = slice.actions;
export const historyReducer = slice.reducer;
