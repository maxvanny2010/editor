import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { ViewportControls } from './ViewportControls';
import { projectsSelectors } from '@/entities/project/model';
import { EditorCanvas } from '@/widgets/canvas/model';
import { useViewportControls } from '../hooks';
import { ToolBar } from '@/widgets/toolbar/model';

const GRID_SPACING = 20;
const LABEL_SPACING = 100;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

export const EditorViewport = () => {
	const active = useAppSelector(projectsSelectors.selectActiveProject);
	const width = active?.width ?? CANVAS_WIDTH;
	const height = active?.height ?? CANVAS_HEIGHT;

	const [showGrid, setShowGrid] = useState(true);
	const toggleGrid = () => setShowGrid((v) => !v);

	const {
		containerRef,
		scale,
		offsetX,
		offsetY,
		handleFit,
		handleReset,
		onMouseDown,
		onMouseMove,
		onMouseUp,
	} = useViewportControls(width, height);

	const drawGrid = (ctx: CanvasRenderingContext2D) => {
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
	};

	return (
		<div
			data-testid="viewport-container"
			ref={containerRef}
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
			className="relative w-full h-full bg-gray-100 dark:bg-gray-900 select-none overflow-hidden flex items-center justify-center"
		>
			{/* ───────── CANVAS ───────── */}
			<div
				style={{
					width,
					height,
					transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
					transformOrigin: 'center',
					border: '1px solid rgba(0,0,0,0.2)',
					boxShadow: '0 0 10px rgba(0,0,0,0.1)',
					background: '#ffffff',
				}}
			>
				<EditorCanvas
					width={width}
					height={height}
					autoResize={false}
					background={'#ffffff'}
					onReady={drawGrid}
				/>
			</div>

			{/* ───────── VIEWPORT CONTROLS ───────── */}
			<ViewportControls
				scale={scale}
				offsetX={offsetX}
				offsetY={offsetY}
				onReset={handleReset}
				onFit={handleFit}
				onToggleGrid={toggleGrid}
				showGrid={showGrid}
			/>

			{/* ───────── TOOLBAR ───────── */}
			<ToolBar position="left">
				{/* <BrushTool />*/}
				{/* <EraserTool /> */}
				{/* <ShapeTool /> */}
				{/* <TextTool /> */}
			</ToolBar>
		</div>
	);
};
