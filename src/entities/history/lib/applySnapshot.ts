import type { AppDispatch, RootState } from '@/store';
import type { EditorSnapshot } from '@/shared/types';
import { replaceFromSnapshot } from '@/entities/layer/model/slice';
import { applyLayerSnapshots } from '@/entities/layer/lib';
import { layerService } from '@/entities/layer/model';

/**
 * 1) Put the snapshot into Redux,
 * 2) Wait for the next frame,
 * 3) Draw on canvases using stable IDs.
 */
export async function applySnapshot(
	snapshot: EditorSnapshot,
	api: { dispatch: AppDispatch; getState: () => RootState },
): Promise<void> {
	const { projectId, layers } = snapshot;

	// Layer replacement in Redux
	api.dispatch(
		replaceFromSnapshot({
			projectId,
			layers: layers.map((l) => ({
				id: l.id,
				name: l.name,
				visible: l.visible,
				opacity: l.opacity,
				zIndex: l.zIndex,
				snapshot: l.snapshot,
			})),
		}),
	);

	// full replace all layers in  Dexie
	await layerService.replaceAll(projectId, layers);

	// Canvas sizes taken from the current state
	const state = api.getState();
	const project = state.projects.entities[projectId];
	if (!project) return;
	const { width, height } = project;

	// Wait for canvases to mount/render
	await new Promise<void>((r) => requestAnimationFrame(() => r()));

	// get canvas by id
	const getCanvas = (id: string) =>
		document.getElementById(`layer-canvas-${id}`) as HTMLCanvasElement | null;

	// Perform drawing
	await applyLayerSnapshots(layers, getCanvas, width, height);
}
