import { db } from '@/shared/lib/db';
import { historyRepository } from '../history.repository';
import type { HistoryEntry } from '@/shared/types';
import { nanoid } from 'nanoid';
import 'fake-indexeddb/auto';

describe('historyRepository', () => {
	beforeEach(async () => {
		await db.history.clear();
	});

	it('adds and retrieves entry by projectId', async () => {
		const entry: HistoryEntry = {
			id: nanoid(),
			label: 'Initial',
			state: {
				projectId: 'p1',
				activeTool: 'brush',
				viewport: { scale: 1, offsetX: 0, offsetY: 0 },
				layers: [],
			},
			timestamp: Date.now(),
		};

		await historyRepository.add(entry);

		const all = await historyRepository.getByProject('p1');
		expect(all.length).toBe(1);
		expect(all[0].id).toBe(entry.id);
	});

	it('clears all entries', async () => {
		const e1: HistoryEntry = {
			id: 'h1',
			label: 'Step 1',
			state: {
				projectId: 'p2',
				activeTool: 'brush',
				viewport: { scale: 1, offsetX: 0, offsetY: 0 },
				layers: [],
			},
			timestamp: Date.now(),
		};
		const e2: HistoryEntry = {
			id: 'h2',
			label: 'Step 2',
			state: { ...e1.state, projectId: 'p3' },
			timestamp: Date.now(),
		};

		await historyRepository.add(e1);
		await historyRepository.add(e2);

		let all = await db.history.toArray();
		expect(all.length).toBe(2);

		await historyRepository.clearAll();
		all = await db.history.toArray();
		expect(all.length).toBe(0);
	});

	it('clears entries by projectId only', async () => {
		const makeEntry = (pid: string): HistoryEntry => ({
			id: nanoid(),
			label: `History ${pid}`,
			state: {
				projectId: pid,
				activeTool: 'brush',
				viewport: { scale: 1, offsetX: 0, offsetY: 0 },
				layers: [],
			},
			timestamp: Date.now(),
		});

		const e1 = makeEntry('p1');
		const e2 = makeEntry('p2');
		const e3 = makeEntry('p1');

		await historyRepository.add(e1);
		await historyRepository.add(e2);
		await historyRepository.add(e3);

		await historyRepository.clearByProject('p1');

		const remaining = await db.history.toArray();
		expect(remaining.length).toBe(1);
		expect(remaining[0].state.projectId).toBe('p2');
	});
});
