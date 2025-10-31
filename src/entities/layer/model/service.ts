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

		// If custom name is given
		if (data.name?.trim()) {
			const maxZ = await layerRepository.getMaxZIndex(data.projectId);
			const newLayer: Layer = {
				id: nanoid(),
				projectId: data.projectId,
				name: data.name.trim(),
				visible: true,
				opacity: 1,
				zIndex: maxZ + 1,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};
			await layerRepository.add(newLayer);
			return newLayer;
		}

		// Otherwise, generate a unique sequential name: "New layer N"
		let maxNumber = 0;
		const regex = /^New layer\s+(\d+)$/i;
		for (const l of layers) {
			const match = l.name.match(regex);
			if (match) {
				const num = parseInt(match[1], 10);
				if (num > maxNumber) maxNumber = num;
			}
		}

		const nextNumber = maxNumber + 1;
		const name = `${LAYER.NEW_LAYER} ${nextNumber}`;

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

	async ensureBaseLayer(projectId: string, baseName: string): Promise<Layer | null> {
		return layerRepository.ensureBaseLayer(projectId, () => ({
			id: nanoid(),
			projectId,
			name: baseName,
			visible: true,
			opacity: 1,
			zIndex: 1,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		}));
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
