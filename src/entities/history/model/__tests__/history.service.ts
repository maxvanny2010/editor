import { describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { loadHistoryFromDB } from '@/entities/history/model/thunk';
import { historyReducer } from '@/entities/history/model/slice';
import { projectsReducer } from '@/entities/project/model/slice';
import { editorReducer } from '@/entities/editor/model/slice';
import { brushReducer } from '@/entities/brush/model/slice';
import { lineReducer } from '@/entities/line/model/slice';
import { shapeReducer } from '@/entities/shape/model/slice';
import { eraserReducer } from '@/entities/eraser/model/slice';
import * as historySvc from '@/entities/history/model';
import type { HistoryEntry } from '@/shared/types';
import type { AppDispatch, RootState } from '@/store';
import { layersReducer } from '@/entities/layer/model';

// ─────────────────────────────────────────────
// Mock history service
// ─────────────────────────────────────────────
vi.spyOn(historySvc, 'historyService', 'get').mockReturnValue({
	saveEntry: vi.fn().mockResolvedValue(undefined),
	loadByProject: vi.fn(
		async (projectId: string): Promise<HistoryEntry[]> => [
			{
				id: 'h1',
				label: 'Draw',
				timestamp: Date.now(),
				state: {
					projectId,
					activeTool: 'brush',
					viewport: { scale: 1, offsetX: 0, offsetY: 0 },
					layers: [],
				},
				toolType: 'brush',
			},
		],
	),
	deleteAfterIndex: vi.fn().mockResolvedValue(undefined),
	resetProject: vi.fn().mockResolvedValue(undefined),
	resetAll: vi.fn().mockResolvedValue(undefined),
});

// ─────────────────────────────────────────────
// Test
// ─────────────────────────────────────────────
describe('loadHistoryFromDB thunk', () => {
	const store = configureStore({
		reducer: {
			history: historyReducer,
			layers: layersReducer,
			projects: projectsReducer,
			editor: editorReducer,
			brush: brushReducer,
			line: lineReducer,
			shape: shapeReducer,
			eraser: eraserReducer,
		},
	});

	// Используем тип из стора
	const dispatch: AppDispatch = store.dispatch;

	it('loads entries and pushes into history', async () => {
		await dispatch(loadHistoryFromDB('P1'));
		const state: RootState = store.getState();
		expect(state.history.stack.length).toBe(1);
		expect(state.history.stack[0].state.projectId).toBe('P1');
	});
});
