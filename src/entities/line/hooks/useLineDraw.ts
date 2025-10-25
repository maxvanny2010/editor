import React, { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeLine } from '@/entities/line/lib/geometry';
import { useAppSelector } from '@/store/hooks';

export function useLineDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const { color, thickness } = useAppSelector((s) => s.line);
	const [start, setStart] = useState<{ x: number; y: number } | null>(null);
	const shiftRef = useRef(false);
	const snapshot = useRef<ImageData | null>(null);

	// Track Shift for snapping
	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => (shiftRef.current = e.shiftKey);
		window.addEventListener('keydown', handleKey);
		window.addEventListener('keyup', handleKey);
		return () => {
			window.removeEventListener('keydown', handleKey);
			window.removeEventListener('keyup', handleKey);
		};
	}, []);

	// Utility: blend base color with white for “active preview” effect
	const getActiveColor = useCallback((hex: string) => {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		// Blend 40% white
		const blend = (c: number) => Math.min(255, Math.round(c + (255 - c) * 0.4));
		return `rgba(${blend(r)}, ${blend(g)}, ${blend(b)}, 0.7)`;
	}, []);

	// Mouse down: save start + snapshot
	const handleMouseDown = useCallback(
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

	// Mouse move: draw preview (light line)
	const handleMouseMove = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!start || !canvasRef.current) return;
			const ctx = canvasRef.current.getContext('2d');
			if (!ctx || !snapshot.current) return;

			ctx.putImageData(snapshot.current, 0, 0);

			const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
			const end = { x: e.clientX - rect.left, y: e.clientY - rect.top };
			const { x1, y1, x2, y2 } = normalizeLine(start, end, shiftRef.current);

			ctx.strokeStyle = getActiveColor(color);
			ctx.lineWidth = thickness;
			ctx.lineCap = 'round';
			ctx.setLineDash([4, 4]); // dotted preview
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			ctx.setLineDash([]); // reset dash
		},
		[start, color, thickness, canvasRef, getActiveColor],
	);

	// Mouse up: draw solid final line
	const handleMouseUp = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!start || !canvasRef.current) return;
			const ctx = canvasRef.current.getContext('2d');
			if (!ctx) return;

			const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
			const end = { x: e.clientX - rect.left, y: e.clientY - rect.top };
			const { x1, y1, x2, y2 } = normalizeLine(start, end, shiftRef.current);

			ctx.strokeStyle = color;
			ctx.lineWidth = thickness;
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();

			snapshot.current = null;
			setStart(null);
		},
		[start, color, thickness, canvasRef],
	);

	return { handleMouseDown, handleMouseMove, handleMouseUp };
}
