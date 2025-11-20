import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithStore } from '@/test-utils';
import { EditorViewport } from '@/widgets/viewport/model';

vi.mock('@/widgets/canvas/model', () => ({
	DrawCanvas: React.forwardRef<HTMLCanvasElement, { width: number; height: number }>(
		({ width, height }, ref) => (
			<canvas ref={ref} data-testid="draw-canvas" width={width} height={height} />
		),
	),
	GridCanvas: React.forwardRef<HTMLCanvasElement, { width: number; height: number }>(
		({ width, height }, ref) => (
			<canvas ref={ref} data-testid="grid-canvas" width={width} height={height} />
		),
	),
	LayerStack: () => <div data-testid="layer-stack" />,
}));

// ---------------------------
// Mock Layers
// ---------------------------
vi.mock('@/entities/layer/model', () => ({
	updateLayer: vi.fn(),
	useLayerCanvases: () => ({
		bindCanvasRef: vi.fn(),
		getCanvas: vi.fn(() => null),
	}),
}));

vi.mock('@/entities/layer/model/selectors', () => {
	const memoLayers: [] = [];

	return {
		layersSelectors: {
			selectActiveLayer: vi.fn(() => null),
		},
		makeSelectByProject: () => {
			return () => memoLayers;
		},
	};
});

vi.mock('@/entities/editor/model/selectors', () => ({
	selectActiveTool: vi.fn(() => null),
}));

vi.mock('@/widgets/viewport/hooks', () => ({
	useViewportControls: () => ({
		containerRef: { current: null },
		scaleRef: { current: 1 },
		offsetXRef: { current: 0 },
		offsetYRef: { current: 0 },
		showGrid: true,
		setShowGrid: vi.fn(),
		handleFit: vi.fn(),
		handleReset: vi.fn(),
		onMouseDown: vi.fn(),
		onMouseMove: vi.fn(),
		onMouseUp: vi.fn(),
		onWheel: vi.fn(),
		isPanning: false,
	}),
}));

vi.mock('@/widgets/toolbar/ui', () => ({
	ToolBar: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="toolbar">{children}</div>
	),
	UndoRedoButtons: () => <div data-testid="undo-redo" />,
}));

vi.mock('@/entities/brush/model', () => ({
	BrushTool: () => <div data-testid="brush-tool" />,
	useBrushDraw: () => ({
		onPointerDown: vi.fn(),
		onPointerMove: vi.fn(),
		onPointerUp: vi.fn(),
	}),
}));

vi.mock('@/entities/line/model', () => ({
	LineTool: () => <div data-testid="line-tool" />,
	useLineDraw: () => ({
		onPointerDown: vi.fn(),
		onPointerMove: vi.fn(),
		onPointerUp: vi.fn(),
	}),
}));

vi.mock('@/entities/shape/model', () => ({
	ShapeTool: () => <div data-testid="shape-tool" />,
	useShapeDraw: () => ({
		onPointerDown: vi.fn(),
		onPointerMove: vi.fn(),
		onPointerUp: vi.fn(),
	}),
}));

vi.mock('@/entities/eraser/model', () => ({
	EraserTool: () => <div data-testid="eraser-tool" />,
	useEraserDraw: () => ({
		onPointerDown: vi.fn(),
		onPointerMove: vi.fn(),
		onPointerUp: vi.fn(),
	}),
}));

describe('EditorViewport — interactions', () => {
	const defaultProps = {
		projectId: 'test-project-1',
		width: 800,
		height: 600,
	};

	test('renders viewport container', () => {
		const { getByTestId } = renderWithStore(<EditorViewport {...defaultProps} />);
		expect(getByTestId('viewport-container')).toBeInTheDocument();
	});

	test('renders canvas elements', () => {
		const { getByTestId } = renderWithStore(<EditorViewport {...defaultProps} />);
		expect(getByTestId('draw-canvas')).toBeInTheDocument();
		expect(getByTestId('grid-canvas')).toBeInTheDocument();
		expect(getByTestId('layer-stack')).toBeInTheDocument();
	});

	test('renders toolbar and tools', () => {
		const { getByTestId } = renderWithStore(<EditorViewport {...defaultProps} />);
		expect(getByTestId('toolbar')).toBeInTheDocument();
		expect(getByTestId('brush-tool')).toBeInTheDocument();
		expect(getByTestId('line-tool')).toBeInTheDocument();
		expect(getByTestId('shape-tool')).toBeInTheDocument();
		expect(getByTestId('eraser-tool')).toBeInTheDocument();
		expect(getByTestId('undo-redo')).toBeInTheDocument();
	});

	test('handles wheel', () => {
		const { getByTestId } = renderWithStore(<EditorViewport {...defaultProps} />);
		const container = getByTestId('viewport-container');
		fireEvent.wheel(container, { deltaY: -100 });
		expect(container).toBeInTheDocument();
	});

	test('handles panning', () => {
		const { getByTestId } = renderWithStore(<EditorViewport {...defaultProps} />);
		const container = getByTestId('viewport-container');
		fireEvent.mouseDown(container, { button: 1 });
		fireEvent.mouseMove(container, { movementX: 40, movementY: 25 });
		fireEvent.mouseUp(container);
		expect(container).toBeInTheDocument();
	});

	test('calls onViewportUpdate', () => {
		const onViewportUpdate = vi.fn();

		renderWithStore(
			<EditorViewport {...defaultProps} onViewportUpdate={onViewportUpdate} />,
		);

		expect(onViewportUpdate).toHaveBeenCalledWith(
			expect.objectContaining({
				scale: expect.any(Number),
				offsetX: expect.any(Number),
				offsetY: expect.any(Number),
				showGrid: expect.any(Boolean),
				handleFit: expect.any(Function),
				handleReset: expect.any(Function),
				toggleGrid: expect.any(Function),
			}),
		);
	});
});
