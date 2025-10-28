import React, { useCallback, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { strokeWidth, toCanvasPoint } from '@/shared/lib/utils';
import { selectViewport } from '@/entities/editor/model/selectors';

export function useEraserDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const size = useAppSelector((s) => s.eraser.size);
	const { scale: viewportScale } = useAppSelector(selectViewport);
	const drawing = useRef(false);
	const last = useRef<{ x: number; y: number } | null>(null);
	const dpr = 1;

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
			ctx.strokeStyle = 'rgba(0,0,0,1)';
			ctx.lineWidth = strokeWidth(size, viewportScale, 'screen');
			ctx.beginPath();
			ctx.moveTo(a.x, a.y);
			ctx.lineTo(b.x, b.y);
			ctx.stroke();
			ctx.restore();
		},
		[size, viewportScale],
	);

	const onPointerDown = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			const canvas = canvasRef.current;
			const ctx = canvas?.getContext('2d');
			if (!ctx || !canvas) return;

			const p = toCanvasPoint(e, canvas, { dpr });
			drawing.current = true;
			last.current = p;
			stroke(ctx, p, p);
		},
		[canvasRef, stroke],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!drawing.current || !canvasRef.current) return;
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');
			if (!ctx || !last.current) return;

			const p = toCanvasPoint(e, canvas, { dpr });
			stroke(ctx, last.current, p);
			last.current = p;
		},
		[canvasRef, stroke],
	);

	const onPointerUp = useCallback(() => {
		drawing.current = false;
		last.current = null;
	}, []);

	return { onPointerDown, onPointerMove, onPointerUp };
}
