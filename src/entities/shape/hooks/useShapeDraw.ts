import React, { useCallback, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { toCanvasPoint } from '@/shared/lib/utils';
import { SHAPES } from '@/shared/constants';

export function useShapeDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const { type, fill, stroke, thickness } = useAppSelector((s) => s.shape);

	const startRef = useRef<{ x: number; y: number } | null>(null);
	const snapshot = useRef<ImageData | null>(null);
	const dpr = 1;

	const onPointerDown = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const ctx = canvas.getContext('2d', { willReadFrequently: true });
			if (!ctx) return;

			startRef.current = toCanvasPoint(e, canvas, { dpr });

			snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
		},
		[canvasRef],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!canvasRef.current || !snapshot.current || !startRef.current) return;
			const canvas = canvasRef.current;
			if (!canvas || !snapshot.current || !startRef.current) return;

			const ctx = canvas.getContext('2d', { willReadFrequently: true });
			if (!ctx) return;

			ctx.putImageData(snapshot.current, 0, 0);

			const start = startRef.current;
			const end = toCanvasPoint(e, canvas, { dpr });

			const x = Math.min(start.x, end.x);
			const y = Math.min(start.y, end.y);
			const w = Math.abs(start.x - end.x);
			const h = Math.abs(start.y - end.y);

			ctx.fillStyle = fill;
			ctx.strokeStyle = stroke;
			ctx.lineWidth = thickness;

			ctx.beginPath();

			if (type === SHAPES.RECT) {
				ctx.rect(x, y, w, h);
			} else if (type === SHAPES.CIRCLE) {
				const radius = Math.sqrt(w * w + h * h) / 2;
				const cx = (start.x + end.x) / 2;
				const cy = (start.y + end.y) / 2;
				ctx.arc(cx, cy, radius, 0, Math.PI * 2);
			}

			if (fill) {
				ctx.fill();
			}
			if (stroke && thickness > 0) {
				ctx.stroke();
			}
		},
		[canvasRef, fill, stroke, thickness, type],
	);

	const onPointerUp = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!canvasRef.current || !startRef.current) return;

			const canvas = canvasRef.current;
			if (!canvas || !startRef.current) return;

			const ctx = canvas.getContext('2d', { willReadFrequently: true });
			if (!ctx) return;

			onPointerMove(e);

			snapshot.current = null;
			startRef.current = null;
		},
		[canvasRef, onPointerMove],
	);

	return { onPointerDown, onPointerMove, onPointerUp };
}
