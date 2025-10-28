import React, { useCallback, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useEraserDraw(
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
	viewportScale: number,
) {
	const size = useAppSelector((s) => s.eraser.size);
	const drawing = useRef(false);
	const last = useRef<{ x: number; y: number } | null>(null);

	const toLocal = (e: React.PointerEvent<HTMLCanvasElement>) => {
		const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
		return { x: e.clientX - rect.left, y: e.clientY - rect.top };
	};

	const stroke = useCallback(
		(
			ctx: CanvasRenderingContext2D,
			from: { x: number; y: number },
			to: { x: number; y: number },
		) => {
			ctx.save();
			ctx.globalCompositeOperation = 'destination-out';
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.strokeStyle = 'rgba(0,0,0,1)';
			ctx.lineWidth = size / Math.max(0.0001, viewportScale);
			ctx.beginPath();
			ctx.moveTo(from.x, from.y);
			ctx.lineTo(to.x, to.y);
			ctx.stroke();
			ctx.restore();
		},
		[size, viewportScale],
	);

	const onPointerDown = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			const ctx = canvasRef.current?.getContext('2d');
			if (!ctx) return;
			const p = toLocal(e);
			drawing.current = true;
			last.current = p;

			stroke(ctx, p, p);
		},
		[canvasRef, stroke],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!drawing.current || !canvasRef.current) return;
			const ctx = canvasRef.current.getContext('2d');
			if (!ctx || !last.current) return;
			const p = toLocal(e);
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
