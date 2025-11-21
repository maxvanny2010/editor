import React from 'react';
import type { CanvasPoint } from '@/shared/types';

/**
 * Returns coordinates in CANVAS SPACE (its internal width/height),
 * regardless of CSS transforms/scale.
 */
export function toCanvasPoint(
	e: React.PointerEvent<HTMLCanvasElement>,
	canvas: HTMLCanvasElement,
	opts?: { dpr?: number },
): CanvasPoint {
	const rect = canvas.getBoundingClientRect();

	// Normalize to [0..1] inside visible rect
	const nx = (e.clientX - rect.left) / rect.width;
	const ny = (e.clientY - rect.top) / rect.height;

	const dpr = opts?.dpr ?? 1;

	return {
		x: (nx * canvas.width) / dpr,
		y: (ny * canvas.height) / dpr,
	};
}
