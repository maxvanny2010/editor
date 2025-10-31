import { db } from '@/shared/lib/db/dexie';
import type { Layer } from '@/shared/types';

export const layerRepository = {
	async getById(id: string): Promise<Layer | undefined> {
		return db.layers.get(id);
	},

	async getAllByProject(projectId: string): Promise<Layer[]> {
		return db.layers.where('projectId').equals(projectId).sortBy('zIndex');
	},

	async getMaxZIndex(projectId: string): Promise<number> {
		const layers = await db.layers.where('projectId').equals(projectId).toArray();
		return layers.length ? Math.max(...layers.map((l) => l.zIndex)) : 0;
	},

	async add(layer: Layer): Promise<void> {
		await db.layers.add(layer);
	},

	async update(id: string, changes: Partial<Layer>): Promise<void> {
		await db.layers.update(id, changes);
	},

	async remove(id: string): Promise<void> {
		await db.layers.delete(id);
	},
};
