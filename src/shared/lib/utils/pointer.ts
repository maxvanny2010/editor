/**
 * Returns coordinates in the CANVAS SPACE (its internal width/height),
 */
import React from 'react';

export function toCanvasPoint(
	e: React.PointerEvent<HTMLCanvasElement>,
	canvas: HTMLCanvasElement,
	opts?: { dpr?: number },
) {
	const rect = canvas.getBoundingClientRect();
	// Normalize to [0..1] inside the visible rectangle (already includes CSS transforms)
	const nx = (e.clientX - rect.left) / rect.width;
	const ny = (e.clientY - rect.top) / rect.height;

	const dpr = opts?.dpr ?? 1;

	return {
		x: (nx * canvas.width) / dpr,
		y: (ny * canvas.height) / dpr,
	};
}
