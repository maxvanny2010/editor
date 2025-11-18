import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { layersSelectors, makeSelectByProject } from '@/entities/layer/model/selectors';
import { DrawCanvas, GridCanvas, LayerStack } from '@/widgets/canvas/model';
import { updateLayer, useLayerCanvases } from '@/entities/layer/model';
import { selectActiveTool } from '@/entities/editor/model/selectors';
import { EraserTool, useEraserDraw } from '@/entities/eraser/model';
import { ToolBar, UndoRedoButtons } from '@/widgets/toolbar/ui';
import { ShapeTool, useShapeDraw } from '@/entities/shape/model';
import { BrushTool, useBrushDraw } from '@/entities/brush/model';
import { useViewportControls } from '@/widgets/viewport/hooks';
import { LineTool, useLineDraw } from '@/entities/line/model';
import type { EditorTool } from '@/shared/types';

/**
 * Handlers for each drawing tool.
 */
interface ToolHandlers {
	onPointerDown?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	onPointerMove?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	onPointerUp?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
}

/**
 * Main drawing viewport of the editor.
 * Manages all drawing tools, layers, and grid.
 */
interface EditorViewportProps {
	isLayersOpen: boolean;
	isHistoryOpen: boolean;
	projectId: string;
	width: number;
	height: number;
	onViewportUpdate?: (data: {
		scale: number;
		offsetX: number;
		offsetY: number;
		showGrid: boolean;
		handleFit: () => void;
		handleReset: () => void;
		toggleGrid: () => void;
	}) => void;
}

export const EditorViewport = ({
	projectId,
	width,
	height,
	onViewportUpdate,
}: EditorViewportProps) => {
	const dispatch = useAppDispatch();
	const didDrawRef = useRef(false);

	const activeTool = useAppSelector(selectActiveTool);
	const selectByProject = useMemo(makeSelectByProject, []);
	const layersAll = useAppSelector((s) => selectByProject(s, projectId));
	const layers = useMemo(
		() => [...layersAll].sort((a, b) => a.zIndex - b.zIndex),
		[layersAll],
	);

	const activeLayer = useAppSelector(layersSelectors.selectActiveLayer);

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

	const toggleGrid = useCallback(() => setShowGrid((v) => !v), [setShowGrid]);

	useEffect(() => {
		if (!onViewportUpdate) return;
		onViewportUpdate({
			scale: viewportScale,
			offsetX,
			offsetY,
			showGrid,
			handleFit,
			handleReset,
			toggleGrid,
		});
	}, [
		onViewportUpdate,
		viewportScale,
		offsetX,
		offsetY,
		showGrid,
		handleFit,
		handleReset,
		toggleGrid,
	]);

	// Canvas refs and drawing logic
	const { bindCanvasRef, getCanvas } = useLayerCanvases(
		layers,
		projectId,
		width,
		height,
	);
	const drawRef = useRef<HTMLCanvasElement | null>(null);

	const brush = useBrushDraw(drawRef);
	const line = useLineDraw(drawRef);
	const shape = useShapeDraw(drawRef);
	const eraser = useEraserDraw(() => (activeLayer ? getCanvas(activeLayer.id) : null));

	const toolHandlers: Partial<Record<Exclude<EditorTool, null>, ToolHandlers>> =
		useMemo(() => ({ brush, line, shape, eraser }), [brush, line, shape, eraser]);

	const activeHandlers = activeTool ? toolHandlers[activeTool] : undefined;

	// ───────────── Tool event handlers ─────────────

	// start draw
	const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
		didDrawRef.current = false;
		activeHandlers?.onPointerDown?.(e);
	};

	// is drawing
	const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
		activeHandlers?.onPointerMove?.(e);
		didDrawRef.current = true;
	};

	// leave a mouse
	const handlePointerUp = async (e: React.PointerEvent<HTMLCanvasElement>) => {
		activeHandlers?.onPointerUp?.(e);

		if (!didDrawRef.current || !activeLayer || !activeTool) return;

		const target = getCanvas(activeLayer.id);
		const drawCanvas = drawRef.current;

		if (target && drawCanvas) {
			const ctx = target.getContext('2d');
			ctx?.drawImage(drawCanvas, 0, 0);
			drawCanvas
				.getContext('2d', { willReadFrequently: true, alpha: true })
				?.clearRect(0, 0, width, height);
			const snapshotPng = target.toDataURL('image/png');

			await dispatch(
				updateLayer({
					id: activeLayer.id,
					changes: { snapshot: snapshotPng },
				}),
			).unwrap();
		}
	};

	return (
		<div
			data-testid="viewport-container"
			ref={containerRef}
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
			className="relative w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center select-none overflow-hidden transition-all duration-300"
		>
			<div
				style={{
					width,
					height,
					position: 'relative',
					transform: `translate(${offsetX}px, ${offsetY}px) scale(${viewportScale})`,
					transformOrigin: 'center',
					border: '1px solid rgba(0,0,0,0.2)',
					background: '#ffffff',
				}}
			>
				<GridCanvas
					width={width}
					height={height}
					showGrid={showGrid}
					background={'#ffffff'}
				/>
				<LayerStack
					layers={layers}
					width={width}
					height={height}
					bindCanvasRef={bindCanvasRef}
					activeLayerId={activeLayer?.id}
				/>
				<DrawCanvas
					ref={drawRef}
					width={width}
					height={height}
					onPointerDown={handlePointerDown}
					onPointerMove={handlePointerMove}
					onPointerUp={handlePointerUp}
					isPanning={isPanning}
				/>
			</div>

			<ToolBar position="left">
				<BrushTool />
				<LineTool />
				<ShapeTool />
				<EraserTool />
				<UndoRedoButtons />
			</ToolBar>
		</div>
	);
};
