import { useCallback, useRef, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { ViewportControls } from './ViewportControls';
import { projectsSelectors } from '@/entities/project/model';
import { EditorCanvas } from '@/widgets/canvas/model';
import { useViewportControls } from '../hooks';
import { ToolBar } from '@/widgets/toolbar/model';
import { BrushTool, useBrushDraw } from '@/entities/brush/model';
import { selectActiveTool } from '@/entities/editor/model/selectors';

const GRID_SPACING = 20;
const LABEL_SPACING = 100;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

export const EditorViewport = () => {
	const activeProject = useAppSelector(projectsSelectors.selectActiveProject);
	const activeTool = useAppSelector(selectActiveTool);

	const width = activeProject?.width ?? CANVAS_WIDTH;
	const height = activeProject?.height ?? CANVAS_HEIGHT;

	const [showGrid, setShowGrid] = useState(true);
	const toggleGrid = () => setShowGrid((v) => !v);

	const {
		containerRef,
		scale: viewportScale,
		offsetX,
		offsetY,
		handleFit,
		handleReset,
		onMouseDown,
		onMouseMove,
		onMouseUp,
	} = useViewportControls(width, height);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const brush = useBrushDraw(canvasRef, viewportScale);

	const drawGrid = useCallback(
		(ctx: CanvasRenderingContext2D) => {
			if (!showGrid) return;
			ctx.save();
			ctx.strokeStyle = '#e5e7eb';
			ctx.lineWidth = 1;

			for (let x = 0; x <= width; x += GRID_SPACING) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, height);
				ctx.stroke();
			}
			for (let y = 0; y <= height; y += GRID_SPACING) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
			}

			ctx.fillStyle = '#9ca3af';
			ctx.font = '10px sans-serif';
			for (let x = 0; x <= width; x += LABEL_SPACING)
				ctx.fillText(String(x), x + 2, 12);
			for (let y = 0; y <= height; y += LABEL_SPACING)
				ctx.fillText(String(y), 2, y - 2);
			ctx.restore();
		},
		[showGrid, width, height],
	);

	return (
		<div
			data-testid="viewport-container"
			ref={containerRef}
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
			className="relative w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center select-none overflow-hidden"
		>
			{/* ───────── CANVAS ───────── */}
			<div
				style={{
					width,
					height,
					transform: `translate(${offsetX}px, ${offsetY}px) scale(${viewportScale})`,
					transformOrigin: 'center',
					border: '1px solid rgba(0,0,0,0.2)',
					boxShadow: '0 0 10px rgba(0,0,0,0.1)',
					background: '#ffffff',
				}}
			>
				<EditorCanvas
					ref={canvasRef}
					width={width}
					height={height}
					autoResize={false}
					background={'#ffffff'}
					onReady={drawGrid}
					onPointerDown={
						activeTool === 'brush' ? brush.onPointerDown : undefined
					}
					onPointerMove={
						activeTool === 'brush' ? brush.onPointerMove : undefined
					}
					onPointerUp={activeTool === 'brush' ? brush.onPointerUp : undefined}
				/>
			</div>

			{/* ───────── VIEWPORT CONTROLS ───────── */}
			<ViewportControls
				scale={viewportScale}
				offsetX={offsetX}
				offsetY={offsetY}
				onReset={handleReset}
				onFit={handleFit}
				onToggleGrid={toggleGrid}
				showGrid={showGrid}
			/>

			{/* ───────── TOOLBAR ───────── */}
			<ToolBar position="left">
				<BrushTool />
			</ToolBar>
		</div>
	);
};
