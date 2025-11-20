import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface GridCanvasProps {
	width: number;
	height: number;
	showGrid: boolean;
	background?: string;
}

/**
 * Static grid background layer with coordinate labels.
 *
 * ForwardRef lets the parent access the canvas element or its context.
 * This component is purely visual and does not handle pointer events.
 */
export const GridCanvas = forwardRef<HTMLCanvasElement, GridCanvasProps>(
	({ width, height, showGrid, background = '#ffffff' }, ref) => {
		const localRef = useRef<HTMLCanvasElement | null>(null);

		// Expose internal ref to parent
		useImperativeHandle(ref, () => localRef.current as HTMLCanvasElement, []);

		useEffect(() => {
			const canvas = localRef.current;
			if (!canvas) return;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			// Clear and fill background
			ctx.clearRect(0, 0, width, height);
			ctx.fillStyle = background;
			ctx.fillRect(0, 0, width, height);

			if (!showGrid) return;

			ctx.save();
			ctx.strokeStyle = '#e5e7eb';
			ctx.lineWidth = 1;

			// Grid spacing constants
			const GRID_SPACING = 20;
			const LABEL_SPACING = 100;

			// Vertical lines
			for (let x = 0; x <= width; x += GRID_SPACING) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, height);
				ctx.stroke();
			}

			// Horizontal lines
			for (let y = 0; y <= height; y += GRID_SPACING) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
			}

			// Axis labels
			ctx.fillStyle = '#9ca3af';
			ctx.font = '10px sans-serif';
			ctx.textBaseline = 'top';

			for (let x = 0; x <= width; x += LABEL_SPACING) {
				ctx.fillText(String(x), x + 2, 2);
			}

			for (let y = LABEL_SPACING; y <= height; y += LABEL_SPACING) {
				ctx.fillText(String(y), 2, y + 2);
			}

			ctx.restore();
		}, [width, height, showGrid, background]);

		return (
			<canvas
				ref={localRef}
				width={width}
				height={height}
				className="absolute inset-0 pointer-events-none"
				data-testid="grid-canvas"
			/>
		);
	},
);

GridCanvas.displayName = 'GridCanvas';
