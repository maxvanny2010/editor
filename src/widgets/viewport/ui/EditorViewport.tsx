import React, { useMemo, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useViewportControls } from '../hooks';
import { ViewportControls } from './ViewportControls';
import { ToolBar } from '@/widgets/toolbar/model';
import { BrushTool, useBrushDraw } from '@/entities/brush/model';
import { LineTool, useLineDraw } from '@/entities/line/model';
import { ShapeTool, useShapeDraw } from '@/entities/shape/model';
import { EraserTool, useEraserDraw } from '@/entities/eraser/model';
import { selectActiveTool } from '@/entities/editor/model/selectors';
import { DrawCanvas, GridCanvas, LayerStack } from '@/widgets/canvas/model';
import { layerService, useLayerCanvases } from '@/entities/layer/model';
import { layersSelectors, makeSelectByProject } from '@/entities/layer/model/selectors';

// ─── Types ────────────────────────────────────────────────
type ToolType = 'brush' | 'eraser' | 'line' | 'shape';

interface ToolHandlers {
	onPointerDown?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	onPointerMove?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	onPointerUp?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
}

interface EditorViewportProps {
	isLayersOpen: boolean;
	projectId: string;
	width: number;
	height: number;
}

export const EditorViewport = ({
	isLayersOpen,
	projectId,
	width,
	height,
}: EditorViewportProps) => {
	// Take only layers of the current project
	const selectByProject = useMemo(makeSelectByProject, []);
	const layersAll = useAppSelector((s) => selectByProject(s, projectId));

	// Sort layers by zIndex (bottom → top)
	const layers = useMemo(
		() => [...layersAll].sort((a, b) => a.zIndex - b.zIndex),
		[layersAll],
	);

	const activeLayer = useAppSelector(layersSelectors.selectActiveLayer);
	const activeTool = useAppSelector(selectActiveTool);

	const {
		containerRef,
		scale: viewportScale,
		offsetX,
		offsetY,
		showGrid,
		setShowGrid,
		handleFit,
		handleReset,
		onMouseDown,
		onMouseMove,
		onMouseUp,
		isPanning,
	} = useViewportControls(width, height, projectId);

	const toggleGrid = () => setShowGrid((v) => !v);

	const gridRef = useRef<HTMLCanvasElement | null>(null);
	const drawRef = useRef<HTMLCanvasElement | null>(null);

	// Layer canvases (real DOM elements)
	const { bindCanvasRef, getCanvas } = useLayerCanvases(
		layers,
		projectId,
		width,
		height,
	);

	// ─── Drawing tool hooks ─────────────────────────────────────
	const brush = useBrushDraw(drawRef);
	const line = useLineDraw(drawRef);
	const shape = useShapeDraw(drawRef);
	const eraser = useEraserDraw(() => (activeLayer ? getCanvas(activeLayer.id) : null));

	// ─── Tool handler map ───────────────────────────────────────
	const toolHandlers: Partial<Record<ToolType, ToolHandlers>> = useMemo(
		() => ({ brush, line, shape, eraser }),
		[brush, line, shape, eraser],
	);

	const activeHandlers = activeTool ? toolHandlers[activeTool] : undefined;

	// Save snapshot of the active layer after drawing
	const handlePointerUp = async (e: React.PointerEvent<HTMLCanvasElement>) => {
		activeHandlers?.onPointerUp?.(e);
		if (!activeLayer) return;
		const target = getCanvas(activeLayer.id);
		const drawCanvas = drawRef.current;
		if (target && drawCanvas) {
			const ctx = target.getContext('2d');
			ctx?.drawImage(drawCanvas, 0, 0);
			drawCanvas.getContext('2d')?.clearRect(0, 0, width, height);
			const snapshot = target.toDataURL('image/png');
			await layerService.updateLayer({ id: activeLayer.id, changes: { snapshot } });
		}
	};

	// ─── JSX ─────────────────────────────────────────────────────
	return (
		<div
			data-testid="viewport-container"
			ref={containerRef}
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
			className={`relative w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center select-none overflow-hidden transition-all duration-300 ${
				isLayersOpen ? 'pr-72' : ''
			}`}
		>
			{/* ───────── CANVAS STACK ───────── */}
			<div
				style={{
					width,
					height,
					position: 'relative',
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

				{/* Static layer canvases */}
				<LayerStack
					layers={layers}
					width={width}
					height={height}
					bindCanvasRef={bindCanvasRef}
					activeLayerId={activeLayer?.id}
				/>

				{/* Active drawing layer */}
				<DrawCanvas
					ref={drawRef}
					width={width}
					height={height}
					onPointerDown={activeHandlers?.onPointerDown}
					onPointerMove={activeHandlers?.onPointerMove}
					onPointerUp={handlePointerUp}
					isPanning={isPanning}
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
				isLayersOpen={isLayersOpen}
			/>

			{/* ───────── TOOLBAR ───────── */}
			<ToolBar position="left">
				<BrushTool />
				<LineTool />
				<ShapeTool />
				<EraserTool />
			</ToolBar>
		</div>
	);
};
