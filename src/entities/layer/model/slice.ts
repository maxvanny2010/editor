import { createAsyncEntitySlice } from '@/shared/lib/store';
import { layerService } from '@/entities/layer/model/layer.service';
import type { Layer } from '@/shared/types';
import {
	createAction,
	createAsyncThunk,
	type PayloadAction,
	type UnknownAction,
} from '@reduxjs/toolkit';
import {
	CRUD_ACTION_SUFFIXES,
	ENTITY_LOADING_STATUSES,
	LAYER,
	LAYER_SLICE_ACTIONS,
	NAMES,
} from '@/shared/constants';
import { nanoid } from 'nanoid';

// ───────────────────────────────────────────────
// Base CRUD slice
// ───────────────────────────────────────────────
export const {
	reducer: baseReducer,
	adapter: layersAdapter,
	thunks: {
		fetchAllThunk: fetchLayers,
		createOneThunk: createLayer,
		updateOneThunk: updateLayer,
		deleteOneThunk: deleteLayer,
	},
} = createAsyncEntitySlice<
	Layer,
	{ projectId: string; name?: string },
	{ id: string; changes: Partial<Layer> }
>({
	name: `${NAMES.LAYERS}`,
	fetchAll: async () => {
		throw new Error(LAYER.ERROR_FETCH_BY_PROJECT);
	},
	createOne: layerService.createLayer,
	updateOne: layerService.updateLayer,
	deleteOne: layerService.deleteLayer,
	sortComparer: (a, b) => b.zIndex - a.zIndex,
});

// ───────────────────────────────────────────────
// Extra thunk for loading layers of a specific project
// ───────────────────────────────────────────────
export const fetchLayersByProject = createAsyncThunk<
	{ projectId: string; layers: Layer[] },
	string
>(`${NAMES.LAYERS}${CRUD_ACTION_SUFFIXES.FETCH_BY_PARAM}`, async (projectId) => {
	try {
		const layers = await layerService.getLayers(projectId);
		return { projectId, layers };
	} catch {
		throw new Error(LAYER.ERROR_FETCH_BY_PROJECT);
	}
});

// ───────────────────────────────────────────────
// State extensions
// ───────────────────────────────────────────────
const baseInitialState = baseReducer(undefined, { type: '@@INIT' });

export type BaseLayersState = typeof baseInitialState;

export interface LayersState extends BaseLayersState {
	activeId: string | null;
	projectId: string | null;
}

export const initialState: LayersState = {
	...baseInitialState,
	activeId: null,
	projectId: null,
};

// ───────────────────────────────────────────────
// Actions
// ───────────────────────────────────────────────
export const setActiveLayerId = createAction<string | null>(
	`${LAYER_SLICE_ACTIONS.SET_ACTIVE_ID}`,
);
export const setCurrentProjectId = createAction<string | null>(
	`${LAYER_SLICE_ACTIONS.SET_CURRENT_PROJECT}`,
);
export const updateLayerSnapshot = createAction<{
	id: string;
	changes: Partial<Layer>;
}>(`${LAYER_SLICE_ACTIONS.UPDATE_SNAPSHOT}`);

export const replaceFromSnapshot = createAction<{
	projectId: string;
	layers: Partial<Layer>[];
}>(`${LAYER_SLICE_ACTIONS.REPLACE_FROM_SNAPSHOT}`);

// ───────────────────────────────────────────────
// Reducer
// ───────────────────────────────────────────────
export function layersReducer(
	state: LayersState = initialState,
	action: UnknownAction,
): LayersState {
	const base = baseReducer(state, action) as LayersState;

	switch (true) {
		// ───────────────────────────────
		// Set active layer
		// ───────────────────────────────
		case setActiveLayerId.match(action): {
			return { ...base, activeId: action.payload };
		}

		// ───────────────────────────────
		// Update snapshot of a layer
		// ───────────────────────────────
		case updateLayerSnapshot.match(action): {
			const { id, changes } = action.payload;
			const existing = base.entities[id];

			if (existing) {
				// update current layer
				return layersAdapter.updateOne(base, { id, changes });
			} else {
				const newLayer: Layer = {
					id,
					projectId: base.projectId ?? 'unknown',
					name: LAYER.RESTORED_LAYER,
					visible: changes.visible ?? true,
					opacity: changes.opacity ?? 1,
					zIndex: changes.zIndex ?? 0,
					snapshot: changes.snapshot ?? '',
					createdAt: Date.now(),
					updatedAt: Date.now(),
				};
				return layersAdapter.addOne(base, newLayer);
			}
		}

		// ───────────────────────────────
		// Clear all layers when switching project
		// ───────────────────────────────
		case setCurrentProjectId.match(action): {
			//  Clear layers when switching project
			const cleared = layersAdapter.removeAll(base);
			return { ...cleared, activeId: null, projectId: action.payload };
		}

		// ───────────────────────────────
		// Fetch layers by project
		// ───────────────────────────────
		case fetchLayersByProject.pending.match(action): {
			return { ...base, loading: ENTITY_LOADING_STATUSES.PENDING, error: null };
		}

		case fetchLayersByProject.fulfilled.match(action): {
			const { projectId, layers } = action.payload;
			// setAll returns a new immutable state instance
			const updated = layersAdapter.setAll(base, layers);

			// Automatically activate the first layer if exists
			const firstLayer = layers.length > 0 ? layers[0].id : null;

			return {
				...updated,
				projectId,
				activeId: firstLayer,
				loading: ENTITY_LOADING_STATUSES.SUCCEEDED,
				error: null,
			};
		}

		case fetchLayersByProject.rejected.match(action): {
			return {
				...base,
				loading: ENTITY_LOADING_STATUSES.FAILED,
				error: action.error.message ?? LAYER.ERROR_FETCH_BY_PROJECT,
			};
		}

		// ───────────────────────────────
		// Layer created → set as active
		// ───────────────────────────────
		case createLayer.fulfilled.match(action): {
			const layer = (action as PayloadAction<Layer>).payload;
			const updated = layersAdapter.addOne(base, layer);
			return { ...updated, activeId: layer.id };
		}

		// ───────────────────────────────
		// Layer deleted → select next top
		// ───────────────────────────────
		case deleteLayer.fulfilled.match(action): {
			const deletedId = (action as PayloadAction<string>).payload;
			const updated = layersAdapter.removeOne(base, deletedId);

			if (base.activeId === deletedId) {
				const remaining = layersAdapter.getSelectors().selectAll(updated);
				const next = remaining.length
					? remaining.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
					: null;
				return { ...updated, activeId: next ? next.id : null };
			}

			return updated;
		}

		// ───────────────
		// Replace all from snapshot (атомарно)
		// ───────────────
		case replaceFromSnapshot.match(action): {
			const { projectId, layers } = action.payload;

			// clear for current project and set a projectId
			let cleared = layersAdapter.removeAll(base);
			cleared = { ...cleared, projectId, activeId: null };

			// collect Layer object
			const now = Date.now();
			const fullLayers: Layer[] = layers.map((l, idx) => ({
				id: l.id ?? nanoid(),
				projectId,
				name: l.name ?? LAYER.NAME(idx + 1),
				visible: l.visible ?? true,
				opacity: l.opacity ?? 1,
				zIndex: l.zIndex ?? idx,
				snapshot: l.snapshot ?? '',
				createdAt: now,
				updatedAt: now,
			}));

			// set from history
			const updated = layersAdapter.setAll(cleared, fullLayers);

			// higher layer set active
			const nextActive = fullLayers.length ? fullLayers[0].id : null;

			return {
				...updated,
				activeId: nextActive,
				loading: ENTITY_LOADING_STATUSES.SUCCEEDED,
				error: null,
			};
		}

		default:
			return base;
	}
}
