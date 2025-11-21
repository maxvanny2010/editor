import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface GridCanvasProps {
	width: number;
	height: number;
	showGrid: boolean;
	background?: string;
}

export const GridCanvas = forwardRef<HTMLCanvasElement, GridCanvasProps>(
	({ width, height, showGrid, background = '#ffffff' }, ref) => {
		const canvasRef = useRef<HTMLCanvasElement | null>(null);

		// buffer. draw a grid one time
		const bufferRef = useRef<HTMLCanvasElement | null>(null);

		useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement, []);

		// create buffer
		useEffect(() => {
			const buf = document.createElement('canvas');
			buf.width = width;
			buf.height = height;
			bufferRef.current = buf;

			const ctx = buf.getContext('2d');
			if (!ctx) return;

			ctx.fillStyle = background;
			ctx.fillRect(0, 0, width, height);

			const GRID = 20;
			const LABEL = 100;

			ctx.strokeStyle = '#e5e7eb';
			ctx.lineWidth = 1;

			for (let x = 0; x <= width; x += GRID) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, height);
				ctx.stroke();
			}

			for (let y = 0; y <= height; y += GRID) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
			}

			ctx.fillStyle = '#9ca3af';
			ctx.font = '10px sans-serif';
			ctx.textBaseline = 'top';

			for (let x = 0; x <= width; x += LABEL) ctx.fillText(String(x), x + 2, 2);
			for (let y = LABEL; y <= height; y += LABEL)
				ctx.fillText(String(y), 2, y + 2);
		}, [width, height, background]);

		// buffer to canvas
		useEffect(() => {
			const canvas = canvasRef.current;
			const buf = bufferRef.current;
			if (!canvas || !buf) return;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			ctx.clearRect(0, 0, width, height);

			if (showGrid) {
				ctx.drawImage(buf, 0, 0);
			} else {
				ctx.fillStyle = background;
				ctx.fillRect(0, 0, width, height);
			}
		}, [showGrid, width, height, background]);

		return (
			<canvas
				ref={canvasRef}
				width={width}
				height={height}
				className="absolute inset-0 pointer-events-none"
				data-testid="grid-canvas"
			/>
		);
	},
);

GridCanvas.displayName = 'GridCanvas';
