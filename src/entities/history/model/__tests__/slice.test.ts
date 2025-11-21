import {
	historyReducer,
	jumpTo,
	pushState,
	redo,
	resetHistory,
	undo,
} from '@/entities/history/model/slice';
import type { HistoryEntry, HistoryState } from '@/shared/types';

describe('history slice', () => {
	const makeState = (entries: HistoryEntry[], index: number): HistoryState => ({
		stack: entries,
		currentIndex: index,
		isPreview: false,
	});

	it('pushState adds a new entry and updates index', () => {
		const initial: HistoryState = makeState([], -1);
		const entry: HistoryEntry = {
			id: '1',
			label: 'Created layer',
			timestamp: Date.now(),
			state: {
				projectId: 'p1',
				layers: [],
				activeTool: 'brush',
				viewport: { scale: 1, offsetX: 0, offsetY: 0 },
			},
		};

		const next = historyReducer(initial, pushState(entry));
		expect(next.stack).toHaveLength(1);
		expect(next.currentIndex).toBe(0);
		expect(next.stack[0].label).toBe('Created layer');
	});

	it('undo decreases currentIndex', () => {
		const s = makeState(
			[
				{
					id: '1',
					label: 'First',
					timestamp: 1,
					state: {
						projectId: 'p',
						layers: [],
						activeTool: 'brush',
						viewport: { scale: 1, offsetX: 0, offsetY: 0 },
					},
				},
				{
					id: '2',
					label: 'Second',
					timestamp: 2,
					state: {
						projectId: 'p',
						layers: [],
						activeTool: 'brush',
						viewport: { scale: 1, offsetX: 0, offsetY: 0 },
					},
				},
			],
			1,
		);
		const next = historyReducer(s, undo());
		expect(next.currentIndex).toBe(0);
	});

	it('redo increases currentIndex', () => {
		const s = makeState(
			[
				{
					id: '1',
					label: 'First',
					timestamp: 1,
					state: {
						projectId: 'p',
						layers: [],
						activeTool: 'brush',
						viewport: { scale: 1, offsetX: 0, offsetY: 0 },
					},
				},
				{
					id: '2',
					label: 'Second',
					timestamp: 2,
					state: {
						projectId: 'p',
						layers: [],
						activeTool: 'brush',
						viewport: { scale: 1, offsetX: 0, offsetY: 0 },
					},
				},
			],
			0,
		);
		const next = historyReducer(s, redo());
		expect(next.currentIndex).toBe(1);
	});

	it('jumpTo moves to specific index', () => {
		const s = makeState(
			[
				{
					id: '1',
					label: 'A',
					timestamp: 1,
					state: {
						projectId: 'p',
						layers: [],
						activeTool: 'brush',
						viewport: { scale: 1, offsetX: 0, offsetY: 0 },
					},
				},
				{
					id: '2',
					label: 'B',
					timestamp: 2,
					state: {
						projectId: 'p',
						layers: [],
						activeTool: 'brush',
						viewport: { scale: 1, offsetX: 0, offsetY: 0 },
					},
				},
			],
			0,
		);
		const next = historyReducer(s, jumpTo(1));
		expect(next.currentIndex).toBe(1);
	});

	it('resetHistory returns initial state', () => {
		const filled = makeState(
			[
				{
					id: 'x',
					label: 'L',
					timestamp: 1,
					state: {
						projectId: 'p',
						layers: [],
						activeTool: 'brush',
						viewport: { scale: 1, offsetX: 0, offsetY: 0 },
					},
				},
			],
			0,
		);
		const reset = historyReducer(filled, resetHistory());
		expect(reset.stack).toHaveLength(0);
		expect(reset.currentIndex).toBe(-1);
	});
});
