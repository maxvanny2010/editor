import React, { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeLine } from '@/entities/line/lib/geometry';
import { useAppSelector } from '@/store/hooks';
import { strokeWidth, toCanvasPoint } from '@/shared/lib/utils';
import { selectViewport } from '@/entities/editor/model/selectors';

export function useLineDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const { color, thickness } = useAppSelector((s) => s.line);
	const { scale: viewportScale } = useAppSelector(selectViewport);
	const [start, setStart] = useState<{ x: number; y: number } | null>(null);
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
			const p = toCanvasPoint(e, canvas, { dpr });
			setStart(p);
			const ctx = canvas.getContext('2d');
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
			if (!start || !canvasRef.current) return;
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');
			if (!ctx || !snapshot.current) return;

			ctx.putImageData(snapshot.current, 0, 0);

			const end = toCanvasPoint(e, canvas, { dpr });
			const { x1, y1, x2, y2 } = normalizeLine(start, end, shiftRef.current);

			ctx.strokeStyle = blendPreview(color);
			ctx.lineWidth = strokeWidth(thickness, viewportScale, 'screen');
			ctx.lineCap = 'round';
			ctx.setLineDash([4, 4]);
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			ctx.setLineDash([]);
		},
		[start, color, thickness, canvasRef, blendPreview, viewportScale],
	);

	const onPointerUp = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!start || !canvasRef.current) return;
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const end = toCanvasPoint(e, canvas, { dpr });
			const { x1, y1, x2, y2 } = normalizeLine(start, end, shiftRef.current);

			ctx.strokeStyle = color;
			ctx.lineWidth = strokeWidth(thickness, viewportScale, 'screen');
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();

			snapshot.current = null;
			setStart(null);
		},
		[start, color, thickness, canvasRef, viewportScale],
	);

	return { onPointerDown, onPointerMove, onPointerUp };
}
