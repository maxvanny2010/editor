import React, { useCallback, useRef, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { toCanvasPoint } from '@/shared/lib/utils';

export function useShapeDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const { type, fill, stroke, thickness } = useAppSelector((s) => s.shape);
	const [start, setStart] = useState<{ x: number; y: number } | null>(null);
	const snapshot = useRef<ImageData | null>(null);
	const dpr = 1;

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
		[canvasRef, dpr],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!start || !canvasRef.current || !snapshot.current) return;
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			ctx.putImageData(snapshot.current, 0, 0);

			const p = toCanvasPoint(e, canvas, { dpr });
			const w = p.x - start.x;
			const h = p.y - start.y;

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
		[start, fill, stroke, thickness, type, canvasRef, dpr],
	);

	const onPointerUp = useCallback(() => {
		snapshot.current = null;
		setStart(null);
	}, []);

	return { onPointerDown, onPointerMove, onPointerUp };
}
