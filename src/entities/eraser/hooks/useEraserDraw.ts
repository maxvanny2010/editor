import React, { useCallback, useEffect, useRef } from 'react';
import { toCanvasPoint } from '@/shared/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { selectEraserSize } from '@/entities/eraser/model';
import type { MaybePoint } from '@/shared/types';

/**
 * Eraser tool — erases pixels directly on the active layer.
 * Includes live size indicator (cursor circle).
 */
export function useEraserDraw(getActiveCanvas: () => HTMLCanvasElement | null) {
	const size = useAppSelector(selectEraserSize);
	const drawing = useRef(false);
	const last = useRef<MaybePoint>(null);
	const dpr = window.devicePixelRatio ?? 1;

	// Cursor indicator (mini overlay circle)
	useEffect(() => {
		const canvas = getActiveCanvas();
		if (!canvas) return;
		canvas.style.cursor = 'none'; // hide system cursor

		const context = canvas.getContext('2d');
		if (!context) return;

		const handleMove = (e: MouseEvent) => {
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			// draw small cursor ring
			context.save();
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.beginPath();
			context.arc(x, y, (size * dpr) / 2, 0, Math.PI * 2);
			context.strokeStyle = 'rgba(59,130,246,0.8)'; // blue ring
			context.lineWidth = 1.2 * dpr;
			context.stroke();
			context.restore();
		};

		const handleLeave = () => {
			if (!canvas) return;
			const ctx2 = canvas.getContext('2d');
			ctx2?.clearRect(0, 0, canvas.width, canvas.height);
		};

		canvas.addEventListener('mousemove', handleMove);
		canvas.addEventListener('mouseleave', handleLeave);
		return () => {
			canvas.removeEventListener('mousemove', handleMove);
			canvas.removeEventListener('mouseleave', handleLeave);
			canvas.style.cursor = 'crosshair';
		};
	}, [getActiveCanvas, size, dpr]);

	// ─── Core stroke logic ─────────────────────────────
	const stroke = useCallback(
		(
			ctx: CanvasRenderingContext2D,
			a: { x: number; y: number },
			b: { x: number; y: number },
		) => {
			ctx.save();
			ctx.globalCompositeOperation = 'destination-out';
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.lineWidth = size;
			ctx.lineWidth = size;
			ctx.beginPath();
			ctx.moveTo(a.x, a.y);
			ctx.lineTo(b.x, b.y);
			ctx.stroke();
			ctx.restore();
		},
		[size],
	);

	const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
		const canvas = getActiveCanvas();
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const p = toCanvasPoint(e, canvas, { dpr });
		drawing.current = true;
		last.current = p;
		stroke(ctx, p, p);
	};

	const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
		if (!drawing.current) return;
		const canvas = getActiveCanvas();
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx || !last.current) return;
		const p = toCanvasPoint(e, canvas, { dpr });
		stroke(ctx, last.current, p);
		last.current = p;
	};

	const onPointerUp = () => {
		drawing.current = false;
		last.current = null;
	};

	return { onPointerDown, onPointerMove, onPointerUp };
}
