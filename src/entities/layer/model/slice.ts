import { createAsyncEntitySlice } from '@/shared/lib/store';
import { layerService } from './service';
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
	SLICE_ACTIONS,
} from '@/shared/constants';

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
	name: `${LAYER.SLICE_NAME}`,
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
>(`${LAYER.SLICE_NAME}${CRUD_ACTION_SUFFIXES.FETCH_BY_PARAM}`, async (projectId) => {
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
	`${LAYER.SLICE_NAME}${SLICE_ACTIONS.SET_ACTIVE_ID}`,
);
export const setCurrentProjectId = createAction<string | null>(
	`${LAYER.SLICE_NAME}${SLICE_ACTIONS.SET_CURRENT_PROJECT}`,
);

// ───────────────────────────────────────────────
// Reducer
// ───────────────────────────────────────────────
export function layersReducer(
	state: LayersState = initialState,
	action: UnknownAction,
): LayersState {
	let base = baseReducer(state, action) as LayersState;

	switch (true) {
		// ───────────────────────────────
		// Local synchronous actions
		// ───────────────────────────────
		case setActiveLayerId.match(action): {
			return { ...base, activeId: action.payload };
		}

		case setCurrentProjectId.match(action): {
			//  Clear layers when switching project
			base = layersAdapter.removeAll(base);
			base.activeId = null;
			base.projectId = action.payload;
			return base;
		}

		// ───────────────────────────────
		// Fetch layers by project
		// ───────────────────────────────
		case fetchLayersByProject.pending.match(action): {
			return {
				...base,
				loading: ENTITY_LOADING_STATUSES.PENDING,
				error: null,
			};
		}

		case fetchLayersByProject.fulfilled.match(action): {
			const { projectId, layers } = (
				action as PayloadAction<{ projectId: string; layers: Layer[] }>
			).payload;

			// setAll returns a new immutable state instance
			const updated = layersAdapter.setAll(base, layers);

			return {
				...updated,
				projectId,
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
		// After layer created: auto-set activeId if not set
		// ───────────────────────────────
		case createLayer.fulfilled.match(action): {
			const layer = (action as PayloadAction<Layer>).payload;
			const updated = layersAdapter.addOne(base, layer);

			// If there is no active layer, make this one active
			if (!base.activeId) {
				return { ...updated, activeId: layer.id };
			}
			return updated;
		}

		// ───────────────────────────────
		// After layer deleted: select nearest top layer
		// ───────────────────────────────
		case deleteLayer.fulfilled.match(action): {
			const deletedId = (action as PayloadAction<string>).payload;
			const updated = layersAdapter.removeOne(base, deletedId);

			if (base.activeId === deletedId) {
				const remaining = layersAdapter.getSelectors().selectAll(updated);
				if (remaining.length > 0) {
					const top = remaining.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
					return { ...updated, activeId: top.id };
				} else {
					return { ...updated, activeId: null };
				}
			}

			return updated;
		}

		// ───────────────────────────────
		// Default
		// ───────────────────────────────
		default:
			return base;
	}
}
