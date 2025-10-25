import { useRef, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { projectsSelectors } from '@/entities/project/model';
import { useViewportControls } from '../hooks';
import { ViewportControls } from './ViewportControls';
import { ToolBar } from '@/widgets/toolbar/model';
import { BrushTool, useBrushDraw } from '@/entities/brush/model';
import { LineTool, useLineDraw } from '@/entities/line/model';
import { selectActiveTool } from '@/entities/editor/model/selectors';
import { DrawCanvas, GridCanvas } from '@/widgets/canvas/model';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

/**
 * The main editor viewport — manages zooming, panning,
 * and multi-layer canvas composition (grid + drawing).
 */
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

	// Layer refs
	const gridRef = useRef<HTMLCanvasElement | null>(null);
	const drawRef = useRef<HTMLCanvasElement | null>(null);

	// Drawing tool hooks
	const brush = useBrushDraw(drawRef, viewportScale);
	const line = useLineDraw(drawRef);

	return (
		<div
			data-testid="viewport-container"
			ref={containerRef}
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
			className="relative w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center select-none overflow-hidden"
		>
			{/* ───────── CANVAS STACK ───────── */}
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
				className="relative"
			>
				{/* Static grid background */}
				<GridCanvas
					ref={gridRef}
					width={width}
					height={height}
					showGrid={showGrid}
					background={'#ffffff'}
				/>

				{/* Active drawing layer */}
				<DrawCanvas
					ref={drawRef}
					width={width}
					height={height}
					onPointerDown={
						activeTool === 'brush'
							? brush.onPointerDown
							: activeTool === 'line'
								? line.handleMouseDown
								: undefined
					}
					onPointerMove={
						activeTool === 'brush'
							? brush.onPointerMove
							: activeTool === 'line'
								? line.handleMouseMove
								: undefined
					}
					onPointerUp={
						activeTool === 'brush'
							? brush.onPointerUp
							: activeTool === 'line'
								? line.handleMouseUp
								: undefined
					}
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
				<LineTool />
			</ToolBar>
		</div>
	);
};
