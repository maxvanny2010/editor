import React, { useCallback, useEffect, useRef } from 'react';
import { normalizeLine } from '@/entities/line/lib/geometry';
import { useAppSelector } from '@/store/hooks';
import { toCanvasPoint } from '@/shared/lib/utils';
import type { MaybeFrame, MaybePoint } from '@/shared/types';
import { selectLineState } from '@/entities/line/model';

export function useLineDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
	const { color, thickness } = useAppSelector(selectLineState);

	const start = useRef<MaybePoint>(null);
	const current = useRef<MaybePoint>(null);
	const shift = useRef(false);
	const snapshot = useRef<ImageData | null>(null);
	const frameReq = useRef<MaybeFrame>(null);

	const dpr = 1;

	useEffect(() => {
		const handle = (keyboardEvent: KeyboardEvent) => {
			shift.current = keyboardEvent.shiftKey;
		};

		window.addEventListener('keydown', handle);
		window.addEventListener('keyup', handle);

		return () => {
			window.removeEventListener('keydown', handle);
			window.removeEventListener('keyup', handle);
		};
	}, []);

	const blendPreview = useCallback((hex: string) => {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		const mix = (c: number) => Math.min(255, Math.round(c + (255 - c) * 0.4));
		return `rgba(${mix(r)}, ${mix(g)}, ${mix(b)}, 0.7)`;
	}, []);

	const drawLoop = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			frameReq.current = null;
			return;
		}

		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		if (!ctx) {
			frameReq.current = null;
			return;
		}

		if (!start.current || !current.current || !snapshot.current) {
			frameReq.current = window.requestAnimationFrame(drawLoop);
			return;
		}

		// restore snapshot
		ctx.putImageData(snapshot.current, 0, 0);

		// coords
		const { x1, y1, x2, y2 } = normalizeLine(
			start.current,
			current.current,
			shift.current,
		);

		ctx.strokeStyle = blendPreview(color);
		ctx.lineWidth = thickness;
		ctx.lineCap = 'round';
		ctx.setLineDash([4, 4]);

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();

		ctx.setLineDash([]);

		frameReq.current = window.requestAnimationFrame(drawLoop);
	}, [canvasRef, color, thickness, blendPreview]);

	const onPointerDown = (pointerEvent: React.PointerEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		if (!ctx) return;

		start.current = toCanvasPoint(pointerEvent, canvas, { dpr });
		current.current = null;

		snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

		if (!frameReq.current) {
			frameReq.current = window.requestAnimationFrame(drawLoop);
		}
	};

	const onPointerMove = (pointerEvent: React.PointerEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas || !start.current) return;
		current.current = toCanvasPoint(pointerEvent, canvas, { dpr });
	};

	const onPointerUp = (pointerEvent: React.PointerEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas || !start.current) return;

		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		if (!ctx) return;

		const end = toCanvasPoint(pointerEvent, canvas, { dpr });
		const { x1, y1, x2, y2 } = normalizeLine(start.current, end, shift.current);

		// final stroke
		ctx.strokeStyle = color;
		ctx.lineWidth = thickness;
		ctx.lineCap = 'round';

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();

		start.current = null;
		current.current = null;
		snapshot.current = null;

		if (frameReq.current !== null) {
			window.cancelAnimationFrame(frameReq.current);
			frameReq.current = null;
		}
	};

	useEffect(() => {
		return () => {
			if (frameReq.current !== null) {
				window.cancelAnimationFrame(frameReq.current);
			}
		};
	}, []);

	return { onPointerDown, onPointerMove, onPointerUp };
}
