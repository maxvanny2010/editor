import { createAsyncThunk } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { RootState } from '@/store';
import type { HistoryEntry } from '@/shared/types';
import { layerService } from '@/entities/layer/model';
import { historyRepository } from '@/entities/history/api';
import { LAYER, LAYER_DEFAULTS, LAYER_SLICE_ACTIONS, TOOLS } from '@/shared/constants';
import { fetchLayersByProject, setActiveLayerId } from '@/entities/layer/model/slice';

/**
 * Ensures that the project has at least one base layer.
 * Also logs the creation of that base layer in the history.
 */
export const ensureInitialLayer = createAsyncThunk<void, string, { state: RootState }>(
	`${LAYER_SLICE_ACTIONS.LAYER_INIT_BASE}`,
	async (projectId, { dispatch }) => {
		// Atomically create base layer if none exist
		const baseLayer = await layerService.ensureBaseLayer(
			projectId,
			`${LAYER_DEFAULTS.INITIAL_NAME}`,
		);

		// Sync Redux store with DB
		await dispatch(fetchLayersByProject(projectId)).unwrap();

		// Set active layer to the created or first existing one
		if (baseLayer) {
			dispatch(setActiveLayerId(baseLayer.id));

			// Create base layer
			const historyEntry: HistoryEntry = {
				id: nanoid(),
				label: `${LAYER.CREATE_BASE_LAYER(baseLayer.name)}`,
				timestamp: Date.now(),
				toolType: TOOLS.BRUSH,
				state: {
					projectId,
					layers: [
						{
							id: baseLayer.id,
							name: baseLayer.name,
							visible: baseLayer.visible,
							opacity: baseLayer.opacity,
							zIndex: baseLayer.zIndex,
							snapshot: baseLayer.snapshot,
						},
					],
					activeTool: null,
					viewport: { scale: 1, offsetX: 0, offsetY: 0 },
				},
			};

			await historyRepository.add(historyEntry);
		}
	},
);
