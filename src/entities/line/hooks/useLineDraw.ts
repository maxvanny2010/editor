import React, { useCallback, useEffect, useRef } from 'react';
import { normalizeLine } from '@/entities/line/lib/geometry';
import { useAppSelector } from '@/store/hooks';
import { toCanvasPoint } from '@/shared/lib/utils';

export function useLineDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const { color, thickness } = useAppSelector((s) => s.line);
	const startRef = useRef<{ x: number; y: number } | null>(null);
	const shiftRef = useRef(false);
	const snapshot = useRef<ImageData | null>(null);
	const dpr = 1;

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => (shiftRef.current = e.shiftKey);
		window.addEventListener('keydown', handleKey);
		window.addEventListener('keyup', handleKey);
		return () => {
			window.removeEventListener('keydown', handleKey);
			window.removeEventListener('keyup', handleKey);
		};
	}, []);

	const blendPreview = useCallback((hex: string) => {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		const blend = (c: number) => Math.min(255, Math.round(c + (255 - c) * 0.4));
		return `rgba(${blend(r)}, ${blend(g)}, ${blend(b)}, 0.7)`;
	}, []);

	const onPointerDown = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			const canvas = canvasRef.current!;
			startRef.current = toCanvasPoint(e, canvas, { dpr });
			const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
			if (ctx)
				snapshot.current = ctx.getImageData(
					0,
					0,
					ctx.canvas.width,
					ctx.canvas.height,
				);
		},
		[canvasRef],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			const start = startRef.current;
			if (!start || !canvasRef.current) return;
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
			if (!ctx || !snapshot.current) return;

			ctx.putImageData(snapshot.current, 0, 0);

			const end = toCanvasPoint(e, canvas, { dpr });
			const { x1, y1, x2, y2 } = normalizeLine(start, end, shiftRef.current);

			ctx.strokeStyle = blendPreview(color);
			ctx.lineWidth = thickness;
			ctx.lineCap = 'round';
			ctx.setLineDash([4, 4]);
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			ctx.setLineDash([]);
		},
		[color, thickness, canvasRef, blendPreview],
	);

	const onPointerUp = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			const start = startRef.current;
			if (!start || !canvasRef.current) return;
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
			if (!ctx) return;

			const end = toCanvasPoint(e, canvas, { dpr });
			const { x1, y1, x2, y2 } = normalizeLine(start, end, shiftRef.current);

			ctx.strokeStyle = color;
			ctx.lineWidth = thickness;
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();

			snapshot.current = null;
			startRef.current = null;
		},
		[color, thickness, canvasRef],
	);

	return { onPointerDown, onPointerMove, onPointerUp };
}
