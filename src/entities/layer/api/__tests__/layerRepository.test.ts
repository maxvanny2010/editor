import { beforeEach, describe, expect, it } from 'vitest';
import { layerRepository } from '../layer.repository';
import { db } from '@/shared/lib/db/dexie';
import type { Layer } from '@/shared/types';
import { nanoid } from 'nanoid';

describe('layerRepository', () => {
	beforeEach(async () => {
		await db.layers.clear();
	});

	it('add and getById', async () => {
		const now = Date.now();
		const layer: Layer = {
			id: nanoid(),
			projectId: 'p1',
			name: 'Layer 1',
			visible: true,
			opacity: 1,
			zIndex: 0,
			createdAt: now,
			updatedAt: now,
		};

		await layerRepository.add(layer);
		const found = await layerRepository.getById(layer.id);

		expect(found).toEqual(layer);
	});

	it('getAllByProject sorts by zIndex ascending', async () => {
		const base = {
			projectId: 'p2',
			visible: true,
			opacity: 1,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};

		await layerRepository.add({ id: 'l1', name: 'A', zIndex: 2, ...base });
		await layerRepository.add({ id: 'l2', name: 'B', zIndex: 0, ...base });

		const all = await layerRepository.getAllByProject('p2');
		expect(all.map((l) => l.name)).toEqual(['B', 'A']);
	});

	it('update modifies layer', async () => {
		const layer: Layer = {
			id: 'up1',
			projectId: 'p3',
			name: 'Old',
			visible: true,
			opacity: 1,
			zIndex: 1,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		await layerRepository.add(layer);

		await layerRepository.update(layer.id, { name: 'New' });
		const updated = await layerRepository.getById(layer.id);

		expect(updated?.name).toBe('New');
	});

	it('remove deletes the layer', async () => {
		const layer: Layer = {
			id: 'del1',
			projectId: 'p4',
			name: 'Temp',
			visible: true,
			opacity: 1,
			zIndex: 1,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		await layerRepository.add(layer);
		await layerRepository.remove(layer.id);

		const found = await layerRepository.getById(layer.id);
		expect(found).toBeUndefined();
	});

	it('getMaxZIndex returns correct max', async () => {
		const pid = 'p5';
		await layerRepository.add({
			id: 'a',
			projectId: pid,
			name: 'A',
			visible: true,
			opacity: 1,
			zIndex: 1,
			createdAt: 0,
			updatedAt: 0,
		});
		await layerRepository.add({
			id: 'b',
			projectId: pid,
			name: 'B',
			visible: true,
			opacity: 1,
			zIndex: 3,
			createdAt: 0,
			updatedAt: 0,
		});

		const max = await layerRepository.getMaxZIndex(pid);
		expect(max).toBe(3);
	});
});
