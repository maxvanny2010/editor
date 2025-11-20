import React, { useCallback, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { toCanvasPoint } from '@/shared/lib/utils';

export function useBrushDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const { color, size } = useAppSelector((s) => s.brush);
	const isDrawingRef = useRef(false);
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
			ctx.lineWidth = size;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';

			last.current = getPos(e);
			isDrawingRef.current = true;
			canvasRef.current.setPointerCapture(e.pointerId);
		},
		[canvasRef, color, size, getPos],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!isDrawingRef.current || !canvasRef.current || !last.current) return;
			const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true })!;
			if (!ctx) return;

			ctx.lineWidth = size;

			const p = getPos(e);
			const l = last.current;

			ctx.beginPath();
			ctx.moveTo(l.x, l.y);
			ctx.lineTo(p.x, p.y);
			ctx.stroke();

			last.current = p;
		},
		[canvasRef, getPos, size],
	);

	const onPointerUp = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			last.current = null;
			isDrawingRef.current = false;
			if (canvasRef.current?.hasPointerCapture(e.pointerId)) {
				canvasRef.current.releasePointerCapture(e.pointerId);
			}
		},
		[canvasRef],
	);

	return { onPointerDown, onPointerMove, onPointerUp };
}
