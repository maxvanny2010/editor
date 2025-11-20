import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { layersSelectors, makeSelectByProject } from '@/entities/layer/model/selectors';
import { updateLayer, useLayerCanvases } from '@/entities/layer/model';

import { selectActiveTool } from '@/entities/editor/model/selectors';

import { BrushTool, useBrushDraw } from '@/entities/brush/model';
import { LineTool, useLineDraw } from '@/entities/line/model';
import { ShapeTool, useShapeDraw } from '@/entities/shape/model';
import { EraserTool, useEraserDraw } from '@/entities/eraser/model';

import { ToolBar, UndoRedoButtons } from '@/widgets/toolbar/ui';
import { useViewportControls } from '@/widgets/viewport/hooks';

import { DrawCanvas, GridCanvas, LayerStack } from '@/widgets/canvas/model';
import type { EditorTool } from '@/shared/types';

interface ToolHandlers {
	onPointerDown?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	onPointerMove?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	onPointerUp?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
}

/**
 * Main drawing viewport of the editor.
 *
 * Responsibilities:
 * - Manages project layers and connects them to DOM canvases.
 * - Delegates all drawing to "tool hooks" (brush/line/shape/eraser).
 * - Uses "Figma-like" viewport controls: panning/zoom via refs + CSS transforms.
 * - Avoids React re-renders during pointer movement and drawing.
 */
interface EditorViewportProps {
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

type ActiveEditorTool = Exclude<EditorTool, null>;

export const EditorViewport = React.memo(function EditorViewport({
	projectId,
	width,
	height,
	onViewportUpdate,
}: EditorViewportProps) {
	const dispatch = useAppDispatch();
	const didDrawRef = useRef(false);

	// Current active tool from Redux (brush / line / shape / eraser / null)
	const activeTool = useAppSelector(selectActiveTool);

	// Layers for this project
	const selectByProject = useMemo(makeSelectByProject, []);
	const layersAll = useAppSelector((s) => selectByProject(s, projectId));
	const layers = useMemo(
		() => [...layersAll].sort((a, b) => a.zIndex - b.zIndex),
		[layersAll],
	);

	const activeLayer = useAppSelector(layersSelectors.selectActiveLayer);

	const {
		containerRef,
		scaleRef,
		offsetXRef,
		offsetYRef,
		showGrid,
		setShowGrid,
		handleFit,
		handleReset,
		onMouseDown,
		onMouseMove,
		onMouseUp,
		onWheel,
		isPanning,
	} = useViewportControls(width, height);

	const toggleGrid = useCallback(() => setShowGrid((prev) => !prev), [setShowGrid]);

	useEffect(() => {
		if (!onViewportUpdate) return;
		onViewportUpdate({
			scale: scaleRef.current,
			offsetX: offsetXRef.current,
			offsetY: offsetYRef.current,
			showGrid,
			handleFit,
			handleReset,
			toggleGrid,
		});
	}, [
		onViewportUpdate,
		scaleRef,
		offsetXRef,
		offsetYRef,
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

	// Draw canvas sits above all layer canvases and collects pointer input.
	const drawRef = useRef<HTMLCanvasElement | null>(null);

	// Tool hooks — they contain all drawing logic and are independent of React state during pointer move.
	const brushHandlers = useBrushDraw(drawRef);
	const lineHandlers = useLineDraw(drawRef);
	const shapeHandlers = useShapeDraw(drawRef);
	const eraserHandlers = useEraserDraw(() =>
		activeLayer ? getCanvas(activeLayer.id) : null,
	);

	// Stable map of handlers per tool type.
	const toolHandlers: Partial<Record<ActiveEditorTool, ToolHandlers>> = useMemo(
		() => ({
			brush: brushHandlers,
			line: lineHandlers,
			shape: shapeHandlers,
			eraser: eraserHandlers,
		}),
		[brushHandlers, lineHandlers, shapeHandlers, eraserHandlers],
	);

	const activeHandlers = activeTool
		? toolHandlers[activeTool as ActiveEditorTool]
		: undefined;

	// ───────────── Tool event handlers (pointer) ─────────────

	/**
	 * Pointer down:
	 * - reset "didDraw" flag,
	 * - delegate to active tool handlers.
	 */
	const handlePointerDown = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			didDrawRef.current = false;
			activeHandlers?.onPointerDown?.(e);
		},
		[activeHandlers],
	);

	/**
	 * Pointer move:
	 * - delegate to active tool,
	 * - mark that this stroke has drawn something.
	 */
	const handlePointerMove = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			activeHandlers?.onPointerMove?.(e);
			didDrawRef.current = true;
		},
		[activeHandlers],
	);

	/**
	 * Pointer up:
	 * - finish tool handling,
	 * - if we actually drew something, merge draw canvas into active layer
	 *   and save snapshot via Redux.
	 */
	const handlePointerUp = useCallback(
		async (e: React.PointerEvent<HTMLCanvasElement>) => {
			activeHandlers?.onPointerUp?.(e);

			if (!didDrawRef.current || !activeLayer || !activeTool) return;

			const target = getCanvas(activeLayer.id);
			const drawCanvas = drawRef.current;

			if (target && drawCanvas) {
				const ctx = target.getContext('2d');
				ctx?.drawImage(drawCanvas, 0, 0);

				// Clear draw canvas after applying stroke
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
		},
		[activeHandlers, activeLayer, activeTool, dispatch, getCanvas, width, height],
	);

	// -------------------- Render --------------------
	return (
		<div
			data-testid="viewport-container"
			className="relative w-full h-full bg-gray-100 dark:bg-gray-900
                       flex items-center justify-center select-none overflow-hidden"
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
			onWheel={onWheel}
		>
			<div
				ref={containerRef}
				style={{
					width,
					height,
					position: 'relative',
					border: '1px solid rgba(0,0,0,0.2)',
					background: '#ffffff',
				}}
			>
				<GridCanvas width={width} height={height} showGrid={showGrid} />

				<LayerStack
					layers={layers}
					width={width}
					height={height}
					bindCanvasRef={bindCanvasRef}
					activeLayerId={activeLayer?.id ?? null}
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
});
