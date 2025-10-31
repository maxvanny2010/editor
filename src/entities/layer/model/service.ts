import type { Layer } from '@/shared/types';
import { nanoid } from 'nanoid';
import { LAYER } from '@/shared/constants';
import { layerRepository } from '@/entities/layer/api';

export const layerService = {
	async getLayers(projectId: string): Promise<Layer[]> {
		return layerRepository.getAllByProject(projectId);
	},

	async createLayer(data: { projectId: string; name?: string }): Promise<Layer> {
		const layers = await layerRepository.getAllByProject(data.projectId);

		// Ищем максимальный номер из имён существующих слоёв
		let maxNumber = 0;
		for (const l of layers) {
			const match = l.name.match(/New layer\s*(\d+)/); // <-- ищем число после "Новый слой"
			if (match) {
				const num = parseInt(match[1], 10);
				if (num > maxNumber) maxNumber = num;
			}
		}

		const nextNumber = maxNumber + 1;

		const name = data.name?.trim() || `${LAYER.NEW_LAYER} ${nextNumber}`;

		if (!name) throw new Error(LAYER.NAME_EMPTY);

		const maxZ = await layerRepository.getMaxZIndex(data.projectId);

		const newLayer: Layer = {
			id: nanoid(),
			projectId: data.projectId,
			name,
			visible: true,
			opacity: 1,
			zIndex: maxZ + 1,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};

		await layerRepository.add(newLayer);
		return newLayer;
	},

	async updateLayer(args: { id: string; changes: Partial<Layer> }): Promise<Layer> {
		const { id, changes } = args;
		await layerRepository.update(id, { ...changes, updatedAt: Date.now() });
		const updated = await layerRepository.getById(id);
		if (!updated) throw new Error(LAYER.NOT_FOUND_AFTER_UPDATE);
		return updated;
	},

	async deleteLayer(id: string): Promise<void> {
		await layerRepository.remove(id);
	},
};
