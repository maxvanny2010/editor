import React, { useCallback, useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { toCanvasPoint } from '@/shared/lib/utils';
import { selectBrushState } from '@/entities/brush/model';
import type { MaybeFrame, MaybePoint } from '@/shared/types';

export function useBrushDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const { color, size } = useAppSelector(selectBrushState);

	// Refs for logic
	const isDrawingRef = useRef(false);
	const last = useRef<MaybePoint>(null);
	const nextPoint = useRef<MaybePoint>(null);
	const frameReq = useRef<MaybeFrame>(null);

	const dpr = 1;

	// Compute canvas coords
	const getPos = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			const canvas = canvasRef.current;
			if (!canvas) {
				return { x: 0, y: 0 };
			}
			return toCanvasPoint(e, canvas, { dpr });
		},
		[canvasRef],
	);

	/** requestAnimationFrame drawing loop */
	const drawLoop = useCallback(() => {
		const canvas = canvasRef.current;

		if (!isDrawingRef.current || !canvas) {
			frameReq.current = null;
			return;
		}

		const context = canvas.getContext('2d', { willReadFrequently: true });
		if (!context || !last.current || !nextPoint.current) {
			frameReq.current = window.requestAnimationFrame(drawLoop);
			return;
		}

		// Drawing
		context.strokeStyle = color;
		context.lineWidth = size;
		context.lineCap = 'round';
		context.lineJoin = 'round';

		const p1 = last.current;
		const p2 = nextPoint.current;

		context.beginPath();
		context.moveTo(p1.x, p1.y);
		context.lineTo(p2.x, p2.y);
		context.stroke();

		// last point becomes current
		last.current = p2;
		nextPoint.current = null;

		frameReq.current = window.requestAnimationFrame(drawLoop);
	}, [canvasRef, color, size]);

	/** Pointer down — prepare stroke */
	const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		last.current = getPos(e);

		isDrawingRef.current = true;

		canvas.setPointerCapture(e.pointerId);

		// Start loop only once
		if (!frameReq.current) {
			frameReq.current = window.requestAnimationFrame(drawLoop);
		}
	};

	/** Pointer move — only update coordinates */
	const onPointerMove = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!isDrawingRef.current) return;
			nextPoint.current = getPos(e);
		},
		[getPos],
	);

	/** Pointer up — finish stroke */
	const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
		isDrawingRef.current = false;
		last.current = null;
		nextPoint.current = null;

		const canvas = canvasRef.current;
		if (canvas && canvas.hasPointerCapture(e.pointerId)) {
			canvas.releasePointerCapture(e.pointerId);
		}
	};

	// Cleanup rAF on unmount
	useEffect(() => {
		return () => {
			if (frameReq.current !== null) {
				window.cancelAnimationFrame(frameReq.current);
			}
		};
	}, []);

	return { onPointerDown, onPointerMove, onPointerUp };
}
