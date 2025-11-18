import React, { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setBrushDrawing } from '@/entities/brush/model/slice';
import { strokeWidth, toCanvasPoint } from '@/shared/lib/utils';
import { selectViewport } from '@/entities/editor/model/selectors';

export function useBrushDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const { color, size, isDrawing } = useAppSelector((s) => s.brush);
	const { scale: viewportScale } = useAppSelector(selectViewport);
	const dispatch = useAppDispatch();
	const last = useRef<{ x: number; y: number } | null>(null);
	const dpr = 1;

	const getPos = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			const canvas = canvasRef.current!;
			return toCanvasPoint(e, canvas, { dpr });
		},
		[canvasRef],
	);

	const onPointerDown = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!canvasRef.current) return;
			const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true })!;
			if (!ctx) return;

			ctx.strokeStyle = color;
			ctx.lineWidth = strokeWidth(size, viewportScale, 'screen');
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';

			last.current = getPos(e);
			dispatch(setBrushDrawing(true));
			canvasRef.current.setPointerCapture(e.pointerId);
		},
		[canvasRef, color, size, viewportScale, getPos, dispatch],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!isDrawing || !canvasRef.current || !last.current) return;
			const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true })!;
			if (!ctx) return;

			ctx.lineWidth = strokeWidth(size, viewportScale, 'screen');

			const p = getPos(e);
			const l = last.current;

			ctx.beginPath();
			ctx.moveTo(l.x, l.y);
			ctx.lineTo(p.x, p.y);
			ctx.stroke();

			last.current = p;
		},
		[canvasRef, getPos, isDrawing, size, viewportScale],
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
