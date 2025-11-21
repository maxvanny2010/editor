import type { Layer } from '@/shared/types';
import { layerTable } from '@/entities/layer/api';
import { REPOSITORY_FIELDS } from '@/shared/constants';

export const layerRepository = {
	async getById(id: string): Promise<Layer | undefined> {
		return layerTable.get(id);
	},

	async getAllByProject(projectId: string): Promise<Layer[]> {
		return layerTable
			.where(`${REPOSITORY_FIELDS.PROJECT_ID}`)
			.equals(projectId)
			.sortBy(`${REPOSITORY_FIELDS.Z_INDEX}`);
	},

	async getMaxZIndex(projectId: string): Promise<number> {
		const layers = await layerTable
			.where(`${REPOSITORY_FIELDS.PROJECT_ID}`)
			.equals(projectId)
			.toArray();
		return layers.length ? Math.max(...layers.map((l) => l.zIndex)) : 0;
	},

	async add(layer: Layer): Promise<void> {
		await layerTable.put(layer);
	},

	async update(id: string, changes: Partial<Layer>): Promise<void> {
		await layerTable.update(id, changes);
	},

	async remove(id: string): Promise<void> {
		await layerTable.delete(id);
	},

	async removeByProject(projectId: string): Promise<void> {
		await layerTable
			.where(`${REPOSITORY_FIELDS.PROJECT_ID}`)
			.equals(projectId)
			.delete();
	},
};
