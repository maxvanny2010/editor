import { nanoid } from 'nanoid';
import { debounce } from 'lodash-es';
import type { TypedStartListening } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@/store';
import { createLayer, deleteLayer, updateLayer } from './slice';
import { pushState } from '@/entities/history/model/slice';
import { historyService } from '@/entities/history/model';
import type { EditorSnapshot } from '@/shared/types';
import {
	LAYER,
	SHAPE_LABELS,
	SHAPES,
	type SystemIconName,
	TOOL_LABELS,
	TOOLS,
	UI_LABELS,
} from '@/shared/constants';
import { layersSelectors } from '@/entities/layer/model/selectors';

export type HistoryIconName = SystemIconName;

export interface HistoryEntryExt {
	id: string;
	label: string;
	state: EditorSnapshot;
	timestamp: number;
	icon?: HistoryIconName;
	toolType?: 'brush' | 'line' | 'shape' | 'eraser';
	shapeType?: 'rect' | 'circle';
}

let lastUpdateEntry: { id: string; label: string } | null = null;

const flushUpdate = debounce(
	async (entry: HistoryEntryExt, api: { dispatch: AppDispatch }) => {
		api.dispatch(pushState(entry));
		await historyService.saveEntry(entry);
		lastUpdateEntry = null;
	},
	700,
);

export function setupLayerListeners(
	startListening: TypedStartListening<RootState, AppDispatch>,
): void {
	const buildSnapshot = (state: RootState): EditorSnapshot => {
		const projectId = state.projects.activeId ?? 'unknown';
		const layers = layersSelectors.selectAll(state);
		const { viewport, activeTool } = state.editor;

		return {
			projectId,
			activeTool,
			viewport,
			layers: layers.map((l) => ({
				id: l.id,
				name: l.name,
				visible: l.visible,
				opacity: l.opacity,
				zIndex: l.zIndex,
				snapshot: l.snapshot,
			})),
		};
	};

	const createHistoryEntry = (
		label: string,
		state: RootState,
		icon: HistoryIconName,
	): HistoryEntryExt => ({
		id: nanoid(),
		label,
		state: buildSnapshot(state),
		timestamp: Date.now(),
		icon,
	});

	try {
		startListening({
			actionCreator: createLayer.fulfilled,
			effect: async (action, api) => {
				const layer = action.payload;
				const entry = createHistoryEntry(
					`${LAYER.CREATED(layer.name)}`,
					api.getState(),
					'plus-square',
				);
				api.dispatch(pushState(entry));
				await historyService.saveEntry(entry);
			},
		});

		startListening({
			actionCreator: deleteLayer.pending,
			effect: async (action, api) => {
				const state = api.getState();
				const id = action.meta.arg as string;
				const deletedLayer = layersSelectors
					.selectAll(state)
					.find((l) => l.id === id);
				if (!deletedLayer) return;

				const entry = createHistoryEntry(
					`${LAYER.DELETED(deletedLayer.name)}`,
					state,
					'trash',
				);
				api.dispatch(pushState(entry));
				await historyService.saveEntry(entry);
			},
		});

		startListening({
			actionCreator: updateLayer.fulfilled,
			effect: async (action, api) => {
				const layer = action.payload;
				const { changes } = action.meta.arg;
				const state = api.getState();

				// update snapshot (draw)
				if ('snapshot' in changes) {
					const activeTool = state.editor.activeTool;
					const shapeType =
						activeTool === TOOLS.SHAPE ? state.shape.type : undefined;

					const label =
						activeTool === TOOLS.SHAPE
							? shapeType === SHAPES.CIRCLE
								? SHAPE_LABELS.circle
								: SHAPE_LABELS.rect
							: activeTool
								? TOOL_LABELS[activeTool]
								: UI_LABELS.SNAPSHOT;

					const entry: HistoryEntryExt = {
						id: nanoid(),
						label,
						state: {
							projectId:
								state.projects.activeId ?? layer.projectId ?? 'unknown',
							activeTool,
							viewport: state.editor.viewport,
							layers: layersSelectors.selectAll(state).map((l) => ({
								id: l.id,
								name: l.name,
								visible: l.visible,
								opacity: l.opacity,
								zIndex: l.zIndex,
								snapshot: l.snapshot,
							})),
						},
						timestamp: Date.now(),
						toolType: activeTool ?? undefined,
						...(activeTool === TOOLS.SHAPE && shapeType ? { shapeType } : {}),
					};

					api.dispatch(pushState(entry));
					await historyService.saveEntry(entry);
					return;
				}

				//  if changed visibility -  don't save to history
				if ('visible' in changes && Object.keys(changes).length === 1) {
					return;
				}

				// other changes (name, opacity, zIndex)
				let label = `${LAYER.UPDATED(layer.name)}`;
				let icon: HistoryIconName = 'edit';

				if ('opacity' in changes) {
					label = `${LAYER.OPACITY_ADJUSTED(layer.name)}`;
					icon = 'sliders';
				}
				if ('name' in changes) {
					label = `${LAYER.RENAMED(layer.name)}`;
					icon = 'edit';
				}
				if ('zIndex' in changes) {
					const layers = [...layersSelectors.selectAll(state)].sort(
						(a, b) => a.zIndex - b.zIndex,
					);
					const idx = layers.findIndex((l) => l.id === layer.id);
					const above = layers[idx + 1];
					const below = layers[idx - 1];

					if (above && below)
						label = `${LAYER.REORDER_LABEL_SWAP(below.name, above.name)}`;
					else if (above)
						label = `${LAYER.REORDER_LABEL_ABOVE(layer.name, above.name)}`;
					else if (below)
						label = `${LAYER.REORDER_LABEL_BELOW(layer.name, below.name)}`;
					else label = `${LAYER.REORDERED_LAYERS}`;

					icon = 'shuffle';
				}

				const entry = createHistoryEntry(label, state, icon);

				// Debounce for a flash changes
				if (
					lastUpdateEntry &&
					lastUpdateEntry.label === label &&
					lastUpdateEntry.id === layer.id
				) {
					flushUpdate.cancel();
					await flushUpdate(entry, { dispatch: api.dispatch });
				} else {
					lastUpdateEntry = { id: layer.id, label };
					await flushUpdate(entry, { dispatch: api.dispatch });
				}
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === 'test') {
			return;
		}
		throw err;
	}
}
