import { useEffect, useMemo, useRef } from 'react';
import type { Layer } from '@/shared/types';
import { layerService } from '@/entities/layer/model';

/**
 * Manages DOM canvases for layers.
 * - bindCanvasRef(id) binds a real <canvas> element to this layer
 * - when mounted, restores a snapshot if it exists
 * - when unmounted, saves all snapshots to Dexie
 */
export function useLayerCanvases(
	layers: Layer[],
	projectId: string,
	width: number,
	height: number,
) {
	const canvases = useRef<Map<string, HTMLCanvasElement>>(new Map());

	// Stores the most recent snapshot for each layer id to detect real changes
	const lastSnapshots = useRef<Map<string, string>>(new Map());

	// Binds DOM <canvas> to layer id
	const bindCanvasRef = useMemo(
		() => (id: string) => (el: HTMLCanvasElement | null) => {
			if (!el) return;
			canvases.current.set(id, el);

			// ensure proper canvas dimensions
			if (el.width !== width) el.width = width;
			if (el.height !== height) el.height = height;

			// restore snapshot if present
			const layer = layers.find((l) => l.id === id);
			if (layer?.snapshot) {
				const img = new Image();
				img.src = layer.snapshot;
				img.onload = () =>
					el
						.getContext('2d', { willReadFrequently: true })
						?.drawImage(img, 0, 0);

				// baseline for diff vs canvas state
				lastSnapshots.current.set(id, layer.snapshot);
			}
		},
		[layers, width, height],
	);

	// Update all canvas dimensions when width/height changes
	useEffect(() => {
		for (const c of canvases.current.values()) {
			if (c.width !== width) c.width = width;
			if (c.height !== height) c.height = height;
		}
	}, [width, height]);

	// Optional: reset snapshot cache when project changes
	useEffect(() => {
		lastSnapshots.current = new Map();
	}, [projectId]);

	// Save all snapshots when component unmounts or project changes
	useEffect(() => {
		// Capture current references at the time the effect runs
		const mapSnapshot = new Map(canvases.current);
		const lastSaved = new Map(lastSnapshots.current);

		return () => {
			for (const [id, canvas] of mapSnapshot.entries()) {
				const snapshot = canvas.toDataURL('image/png');
				const prevSnapshot = lastSaved.get(id);

				// Skip if no change
				if (snapshot === prevSnapshot) continue;

				// Check that layer still exists before saving
				layerService
					.getLayers(projectId)
					.then((all) => {
						if (!all.some((l) => l.id === id)) return;
						return layerService.updateLayer({ id, changes: { snapshot } });
					})
					.catch(() => {
						/* ignore missing/deleted layers */
					});
			}
		};
	}, [projectId]);

	const getCanvas = (id: string) => canvases.current.get(id) ?? null;

	return { bindCanvasRef, getCanvas };
}
