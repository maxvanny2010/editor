import React, { useCallback, useRef, useState } from 'react';
import { normalizeLine } from '@/entities/line/lib/geometry';
import { useAppSelector } from '@/store/hooks';

export function useLineDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const { color, thickness } = useAppSelector((s) => s.line);
	const [start, setStart] = useState<{ x: number; y: number } | null>(null);
	const shiftRef = useRef(false);

	const handleKey = useCallback((e: KeyboardEvent) => {
		shiftRef.current = e.shiftKey;
	}, []);

	const handleMouseDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
		const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
		setStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
	}, []);

	const handleMouseMove = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (!start || !canvasRef.current) return;
			const ctx = canvasRef.current.getContext('2d');
			if (!ctx) return;

			const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
			const end = { x: e.clientX - rect.left, y: e.clientY - rect.top };
			const { x1, y1, x2, y2 } = normalizeLine(start, end, shiftRef.current);

			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.strokeStyle = color;
			ctx.lineWidth = thickness;
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		},
		[start, color, thickness, canvasRef],
	);

	const handleMouseUp = useCallback(() => setStart(null), []);

	useState(() => {
		window.addEventListener('keydown', handleKey);
		window.addEventListener('keyup', handleKey);
		return () => {
			window.removeEventListener('keydown', handleKey);
			window.removeEventListener('keyup', handleKey);
		};
	});

	return { handleMouseDown, handleMouseMove, handleMouseUp };
}
