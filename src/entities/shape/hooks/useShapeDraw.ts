import React, { useCallback, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { toCanvasPoint } from '@/shared/lib/utils';
import { SHAPES } from '@/shared/constants';
import type { MaybePoint } from '@/shared/types';
import { selectShapeState } from '@/entities/shape/model';

export function useShapeDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const { type, fill, stroke, thickness } = useAppSelector(selectShapeState);

	const startRef = useRef<MaybePoint>(null);
	const snapshot = useRef<ImageData | null>(null);
	const dpr = 1;

	const onPointerDown = useCallback(
		(pointerEvent: React.PointerEvent<HTMLCanvasElement>) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const context = canvas.getContext('2d', { willReadFrequently: true });
			if (!context) return;

			startRef.current = toCanvasPoint(pointerEvent, canvas, { dpr });

			snapshot.current = context.getImageData(0, 0, canvas.width, canvas.height);
		},
		[canvasRef],
	);

	const onPointerMove = useCallback(
		(pointerEvent: React.PointerEvent<HTMLCanvasElement>) => {
			if (!canvasRef.current || !snapshot.current || !startRef.current) return;
			const canvas = canvasRef.current;
			if (!canvas || !snapshot.current || !startRef.current) return;

			const context = canvas.getContext('2d', { willReadFrequently: true });
			if (!context) return;

			context.putImageData(snapshot.current, 0, 0);

			const start = startRef.current;
			const end = toCanvasPoint(pointerEvent, canvas, { dpr });

			const x = Math.min(start.x, end.x);
			const y = Math.min(start.y, end.y);
			const w = Math.abs(start.x - end.x);
			const h = Math.abs(start.y - end.y);

			context.fillStyle = fill;
			context.strokeStyle = stroke;
			context.lineWidth = thickness;

			context.beginPath();

			if (type === SHAPES.RECT) {
				context.rect(x, y, w, h);
			} else if (type === SHAPES.CIRCLE) {
				const radius = Math.sqrt(w * w + h * h) / 2;
				const cx = (start.x + end.x) / 2;
				const cy = (start.y + end.y) / 2;
				context.arc(cx, cy, radius, 0, Math.PI * 2);
			}

			if (fill) {
				context.fill();
			}
			if (stroke && thickness > 0) {
				context.stroke();
			}
		},
		[canvasRef, fill, stroke, thickness, type],
	);

	const onPointerUp = useCallback(
		(pointerEvent: React.PointerEvent<HTMLCanvasElement>) => {
			if (!canvasRef.current || !startRef.current) return;

			const canvas = canvasRef.current;
			if (!canvas || !startRef.current) return;

			const context = canvas.getContext('2d', { willReadFrequently: true });
			if (!context) return;

			onPointerMove(pointerEvent);

			snapshot.current = null;
			startRef.current = null;
		},
		[canvasRef, onPointerMove],
	);

	return { onPointerDown, onPointerMove, onPointerUp };
}
