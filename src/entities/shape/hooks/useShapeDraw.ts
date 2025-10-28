import { useAppSelector } from '@/store/hooks';
import React, { useCallback, useRef, useState } from 'react';

export function useShapeDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const { type, fill, stroke, thickness } = useAppSelector((s) => s.shape);
	const [start, setStart] = useState<{ x: number; y: number } | null>(null);
	const snapshot = useRef<ImageData | null>(null);

	const onPointerDown = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
			setStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
			const ctx = canvasRef.current?.getContext('2d');
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
			if (!start || !canvasRef.current || !snapshot.current) return;
			const ctx = canvasRef.current.getContext('2d');
			if (!ctx) return;

			ctx.putImageData(snapshot.current, 0, 0);
			const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const w = x - start.x;
			const h = y - start.y;

			ctx.lineWidth = thickness;
			ctx.strokeStyle = stroke;
			ctx.fillStyle = fill;

			if (type === 'rect') {
				ctx.strokeRect(start.x, start.y, w, h);
				ctx.globalAlpha = 0.3;
				ctx.fillRect(start.x, start.y, w, h);
				ctx.globalAlpha = 1;
			} else if (type === 'circle') {
				const r = Math.sqrt(w * w + h * h);
				ctx.beginPath();
				ctx.arc(start.x, start.y, r, 0, Math.PI * 2);
				ctx.stroke();
				ctx.globalAlpha = 0.3;
				ctx.fill();
				ctx.globalAlpha = 1;
			}
		},
		[start, fill, stroke, thickness, type, canvasRef],
	);

	const onPointerUp = useCallback(() => {
		snapshot.current = null;
		setStart(null);
	}, []);

	return { onPointerDown, onPointerMove, onPointerUp };
}
