import { createListenerMiddleware, type TypedStartListening } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@/store';
import { applySnapshot } from '@/entities/history/lib';
import { historyService } from '@/entities/history/model';
import {
	jumpTo,
	pushState,
	redo,
	setPreview,
	undo,
} from '@/entities/history/model/slice';

export const listener = createListenerMiddleware();

export function setupHistoryListeners(
	startListening: TypedStartListening<RootState, AppDispatch>,
): void {
	// ───────────────────────────────
	// Manual push (save in Dexie)
	// ───────────────────────────────
	startListening({
		actionCreator: pushState,
		effect: async (action) => {
			await historyService.saveEntry(action.payload);
		},
	});

	// ───────────────────────────────
	// Undo / Redo / JumpTo listeners
	// ───────────────────────────────
	const applyEntry = async (api: {
		dispatch: AppDispatch;
		getState: () => RootState;
	}) => {
		const { stack, currentIndex } = api.getState().history;
		const entry = stack[currentIndex];
		if (!entry?.state) return;

		api.dispatch(setPreview(true));
		await applySnapshot(entry.state, api);

		if (currentIndex === stack.length - 1) api.dispatch(setPreview(false));
	};

	startListening({ actionCreator: undo, effect: async (_, api) => applyEntry(api) });
	startListening({ actionCreator: redo, effect: async (_, api) => applyEntry(api) });
	startListening({ actionCreator: jumpTo, effect: async (_, api) => applyEntry(api) });
}
