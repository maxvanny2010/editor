import React, { forwardRef } from 'react';

interface DrawCanvasProps {
	width: number;
	height: number;
	onPointerDown?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	onPointerMove?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	onPointerUp?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	isPanning: boolean;
	'data-testid'?: string;
}

/**
 * Interactive drawing surface for active tools (brush, eraser, line, shape)
 */
export const DrawCanvas = forwardRef<HTMLCanvasElement, DrawCanvasProps>(
	(
		{
			width,
			height,
			onPointerDown,
			onPointerMove,
			onPointerUp,
			isPanning,
			'data-testid': testId = 'draw-canvas',
		},
		ref,
	) => {
		// НЕ передаём isPanning в canvas!
		const cursor = isPanning ? 'grabbing' : 'crosshair';

		return (
			<canvas
				ref={ref}
				role="presentation"
				width={width}
				height={height}
				className="absolute inset-0"
				style={{
					zIndex: 10,
					cursor,
				}}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				data-testid={testId}
			/>
		);
	},
);

DrawCanvas.displayName = 'DrawCanvas';
