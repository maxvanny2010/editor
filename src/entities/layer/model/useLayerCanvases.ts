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
				img.onload = () => el.getContext('2d')?.drawImage(img, 0, 0);
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

	// Save all snapshots when component unmounts
	useEffect(() => {
		const mapSnapshot = canvases.current;
		return () => {
			for (const [id, canvas] of mapSnapshot.entries()) {
				const snapshot = canvas.toDataURL('image/png');
				void layerService.updateLayer({ id, changes: { snapshot } });
			}
		};
	}, [projectId]);

	const getCanvas = (id: string) => canvases.current.get(id) ?? null;

	return { bindCanvasRef, getCanvas };
}
