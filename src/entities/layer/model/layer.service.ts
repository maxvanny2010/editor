import { nanoid } from 'nanoid';
import type { EditorSnapshot, Layer } from '@/shared/types';
import { layerRepository } from '@/entities/layer/api';
import { LAYER, LAYER_DEFAULTS, LAYER_ERROR_MESSAGES } from '@/shared/constants';
import Dexie from 'dexie';

export const layerService = {
	async getLayers(projectId: string): Promise<Layer[]> {
		return layerRepository.getAllByProject(projectId);
	},

	async createLayer({
		projectId,
		name,
	}: {
		projectId: string;
		name?: string;
	}): Promise<Layer> {
		const layers = await layerRepository.getAllByProject(projectId);
		const maxZ = layers.length > 0 ? Math.max(...layers.map((l) => l.zIndex)) : -1;
		const nextZ = maxZ + 1;

		let nextIndex = 1;
		for (const l of layers) {
			const match = l.name.match(/(\d+)$/);
			if (match) {
				const num = parseInt(match[1], 10);
				if (num >= nextIndex) nextIndex = num + 1;
			}
		}

		const layer: Layer = {
			id: nanoid(),
			projectId,
			name: name?.trim() || `${LAYER.NAME(nextIndex)}`,
			visible: true,
			opacity: 1,
			zIndex: nextZ,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			snapshot: '',
		};

		await layerRepository.add(layer);
		return layer;
	},

	async updateLayer(args: { id: string; changes: Partial<Layer> }): Promise<Layer> {
		const { id, changes } = args;
		await layerRepository.update(id, { ...changes, updatedAt: Date.now() });
		const updated = await layerRepository.getById(id);
		if (!updated) throw new Error(`${LAYER_ERROR_MESSAGES.LAYER_NOT_FOUND(id)}`);
		return updated;
	},

	async deleteLayer(id: string): Promise<string> {
		await layerRepository.remove(id);
		return id;
	},

	async ensureBaseLayer(
		projectId: string,
		defaultName = `${LAYER_DEFAULTS.INITIAL_NAME}`,
	): Promise<Layer | null> {
		const layers = await layerRepository.getAllByProject(projectId);
		if (layers.length > 0) return null;
		return this.createLayer({ projectId, name: defaultName });
	},
	async replaceAll(projectId: string, layers: EditorSnapshot['layers']) {
		// remove all layers from project
		await layerRepository.removeByProject(projectId);
		await Dexie.waitFor(Promise.resolve());
		// add layers from a snapshot
		for (const l of layers) {
			await layerRepository.add({
				id: l.id,
				projectId,
				name: l.name,
				visible: l.visible,
				opacity: l.opacity,
				zIndex: l.zIndex,
				snapshot: l.snapshot,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
		}
	},
};
