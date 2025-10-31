import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/shared/lib/db';
import type { ProjectViewState } from '@/shared/types';
import { ViewportRepository } from '@/widgets/viewport/api';

// Mock Dexie database
vi.mock('@/shared/lib/db', () => {
	const map = new Map<string, ProjectViewState>();
	return {
		db: {
			table: vi.fn(() => ({
				get: vi.fn((id: string) => Promise.resolve(map.get(id))),
				put: vi.fn((state: ProjectViewState) => {
					map.set(state.projectId, state);
					return Promise.resolve();
				}),
			})),
		},
	};
});

describe('ViewportRepository', () => {
	const sample: ProjectViewState = {
		showGrid: false,
		projectId: 'p1',
		scale: 1.2,
		offsetX: 100,
		offsetY: 200,
	};

	beforeEach(async () => {
		// clear table
		const table = db.table<ProjectViewState>('viewStates');
		await table.put(sample);
	});

	it('should save state to Dexie table', async () => {
		const newState: ProjectViewState = {
			showGrid: false,
			projectId: 'p2',
			scale: 0.8,
			offsetX: -50,
			offsetY: 30,
		};

		await ViewportRepository.save(newState);
		const result = await ViewportRepository.get('p2');

		expect(result).toEqual(newState);
	});

	it('should get existing state by projectId', async () => {
		const result = await ViewportRepository.get('p1');

		expect(result).toBeDefined();
		expect(result?.scale).toBe(1.2);
		expect(result?.offsetX).toBe(100);
		expect(result?.offsetY).toBe(200);
	});

	it('should overwrite existing state if saved again', async () => {
		const updated: ProjectViewState = {
			...sample,
			showGrid: false,
			scale: 2,
			offsetX: 300,
			offsetY: 400,
		};

		await ViewportRepository.save(updated);
		const result = await ViewportRepository.get('p1');

		expect(result).toEqual(updated);
	});
});
