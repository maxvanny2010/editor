import { beforeEach, describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
	createLayer,
	deleteLayer,
	fetchLayersByProject,
	layersReducer,
	setActiveLayerId,
	updateLayer,
} from '../slice';
import type { Layer } from '@/shared/types';
import { db } from '@/shared/lib/db/dexie';
import { layerRepository } from '@/entities/layer/api';
import { makeSelectors } from '@/shared/lib/store';
import { nanoid } from 'nanoid';

const storeFactory = () =>
	configureStore({
		reducer: { layers: layersReducer },
	});

type TestRootState = ReturnType<ReturnType<typeof storeFactory>['getState']>;

const selectors = makeSelectors<TestRootState, Layer>((s) => s.layers);

describe('layersSlice', () => {
	beforeEach(async () => {
		await db.layers.clear();
	});

	it('fetchLayersByProject populates state', async () => {
		const pid = 'p1';
		const now = Date.now();
		const recs: Layer[] = [
			{
				id: nanoid(),
				projectId: pid,
				name: 'A',
				visible: true,
				opacity: 1,
				zIndex: 0,
				createdAt: now,
				updatedAt: now,
			},
			{
				id: nanoid(),
				projectId: pid,
				name: 'B',
				visible: true,
				opacity: 1,
				zIndex: 1,
				createdAt: now,
				updatedAt: now,
			},
		];
		for (const r of recs) await layerRepository.add(r);

		const store = storeFactory();
		await store.dispatch(fetchLayersByProject(pid));

		const all = selectors.selectAll(store.getState());
		expect(all.length).toBe(2);
		expect(all.map((l) => l.name).sort()).toEqual(['A', 'B']);
	});

	it('createLayer adds new entity', async () => {
		const store = storeFactory();
		await store.dispatch(createLayer({ projectId: 'p2' }));

		const all = selectors.selectAll(store.getState());
		expect(all.length).toBe(1);
		expect(all[0]?.projectId).toBe('p2');
	});

	it('updateLayer modifies entity', async () => {
		const store = storeFactory();
		const l = await store.dispatch(createLayer({ projectId: 'p3' })).unwrap();

		await store.dispatch(updateLayer({ id: l.id, changes: { name: 'Changed' } }));
		const updated = selectors.selectById(store.getState(), l.id);

		expect(updated?.name).toBe('Changed');
	});

	it('deleteLayer removes entity', async () => {
		const store = storeFactory();
		const l = await store.dispatch(createLayer({ projectId: 'p4' })).unwrap();

		await store.dispatch(deleteLayer(l.id));
		const exists = selectors.selectById(store.getState(), l.id);

		expect(exists).toBeUndefined();
	});

	it('setActiveLayerId updates activeId', async () => {
		const store = storeFactory();
		const l = await store.dispatch(createLayer({ projectId: 'p5' })).unwrap();

		store.dispatch(setActiveLayerId(l.id));
		expect(store.getState().layers.activeId).toBe(l.id);
	});
});
