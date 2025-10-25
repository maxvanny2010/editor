import React, { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setBrushDrawing } from '@/entities/brush/model/slice';

export function useBrushDraw(
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
	scale: number,
) {
	const { color, size, isDrawing } = useAppSelector((s) => s.brush);
	const dispatch = useAppDispatch();
	const last = useRef<{ x: number; y: number } | null>(null);

	const getPos = useCallback(
		(e: React.PointerEvent) => {
			const rect = canvasRef.current!.getBoundingClientRect();
			return {
				x: (e.clientX - rect.left) / scale,
				y: (e.clientY - rect.top) / scale,
			};
		},
		[canvasRef, scale],
	);

	const onPointerDown = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!canvasRef.current) return;
			const ctx = canvasRef.current.getContext('2d');
			if (!ctx) return;

			ctx.strokeStyle = color;
			ctx.lineWidth = size;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';

			last.current = getPos(e);
			dispatch(setBrushDrawing(true));
			canvasRef.current.setPointerCapture(e.pointerId);
		},
		[canvasRef, color, size, getPos, dispatch],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!isDrawing || !canvasRef.current || !last.current) return;
			const ctx = canvasRef.current.getContext('2d');
			if (!ctx) return;

			const p = getPos(e);
			const l = last.current;

			ctx.beginPath();
			ctx.moveTo(l.x, l.y);
			ctx.lineTo(p.x, p.y);
			ctx.stroke();

			last.current = p;
		},
		[canvasRef, getPos, isDrawing],
	);

	const onPointerUp = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			last.current = null;
			dispatch(setBrushDrawing(false));
			if (canvasRef.current?.hasPointerCapture(e.pointerId)) {
				canvasRef.current.releasePointerCapture(e.pointerId);
			}
		},
		[dispatch, canvasRef],
	);

	return { onPointerDown, onPointerMove, onPointerUp };
}
