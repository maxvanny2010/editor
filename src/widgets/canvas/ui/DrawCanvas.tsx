import React, { forwardRef } from 'react';

interface DrawCanvasProps {
	width: number;
	height: number;
	onPointerDown?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	onPointerMove?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	onPointerUp?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	'data-testid'?: string;
}

/**
 * Interactive drawing layer for active tools (brush, line, etc.)
 */
export const DrawCanvas = forwardRef<HTMLCanvasElement, DrawCanvasProps>(
	(
		{
			width,
			height,
			onPointerDown,
			onPointerMove,
			onPointerUp,
			'data-testid': testId = 'draw-canvas',
		},
		ref,
	) => {
		return (
			<canvas
				ref={ref}
				role="presentation"
				width={width}
				height={height}
				className="absolute inset-0 cursor-crosshair"
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				data-testid={testId}
			/>
		);
	},
);

DrawCanvas.displayName = 'DrawCanvas';
