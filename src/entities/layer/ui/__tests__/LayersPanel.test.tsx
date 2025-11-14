import { fireEvent, render, screen } from '@testing-library/react';
import { forwardRef } from 'react';
import * as hooks from '@/store/hooks';
import type { AppDispatch, RootState } from '@/store';
import { LayersPanel } from '@/entities/layer/ui';
import type { Layer } from '@/shared/types';

// ──────────────────────────────
// Mock UI components
// ──────────────────────────────
vi.mock('@/entities/layer/ui/components', () => {
	type OpacityProps = {
		activeLayer: Layer | null;
		onOpacityChange: (id: string, value: number) => void;
	};
	interface LayerItemProps {
		layer: Layer;
		isActive: boolean;
		isEditing: boolean;
		openMenuId: string | null;
		onSetActive: (id: string) => void;
		onToggleVisibility: (id: string, visible: boolean) => void;
		onRenameSubmit: (id: string, name: string) => void;
		onDelete: (id: string) => void;
		setLocalNameId: (id: string | null) => void;
		setOpenMenuId: (id: string | null) => void;
	}

	return {
		AddLayerButton: ({ onCreate }: { onCreate: () => void }) => (
			<button data-testid="mock-add-layer-btn" onClick={onCreate}>
				Add Layer
			</button>
		),

		LayerItem: forwardRef<HTMLDivElement, LayerItemProps>(
			({ layer, isActive }, ref) => (
				<div ref={ref} data-testid="mock-layer-item" data-layer-id={layer.id}>
					{layer.name} {isActive && '(active)'}
				</div>
			),
		),

		OpacitySlider: ({ activeLayer }: OpacityProps) => (
			<div data-testid="mock-opacity-slider">
				Opacity: {activeLayer ? activeLayer.opacity : 'N/A'}
			</div>
		),
	};
});

// ──────────────────────────────
// Mock Redux store
// ──────────────────────────────
interface MockState {
	layers: {
		entities: Record<string, { id: string; name: string }>;
	};
	history: { isPreview: boolean };
}

let mockStoreState: MockState = {
	layers: {
		entities: {
			'layer-1': { id: 'layer-1', name: 'Background' },
			'layer-2': { id: 'layer-2', name: 'Foreground' },
		},
	},
	history: { isPreview: false },
};

vi.mock('@/store', () => ({
	store: {
		getState: vi.fn(() => mockStoreState),
	},
}));

// ──────────────────────────────
// Mock hooks and slices
// ──────────────────────────────
vi.mock('@/store/hooks', () => ({
	useAppDispatch: vi.fn(),
	useAppSelector: vi.fn(),
}));

vi.mock('@/entities/layer/model/slice', () => {
	const mockReducer = (state = {}) => state;

	return {
		layersReducer: mockReducer,
		createLayer: vi.fn((payload: { projectId: string }) => ({
			type: 'layers/createLayer',
			payload,
		})),
		deleteLayer: vi.fn((id: string) => ({
			type: 'layers/deleteLayer',
			payload: id,
		})),
		updateLayer: vi.fn((payload: { id: string; changes: Partial<Layer> }) => ({
			type: 'layers/updateLayer',
			payload,
		})),
		setActiveLayerId: vi.fn((id: string) => ({
			type: 'layers/setActiveLayerId',
			payload: id,
		})),
		fetchLayersByProject: vi.fn((projectId: string) => ({
			type: 'layers/fetchLayersByProject',
			payload: projectId,
		})),
	};
});

vi.mock('@/entities/layer/model/selectors', () => {
	const createMockLayers = (): Layer[] => [
		{
			id: 'layer-1',
			name: 'Background',
			visible: true,
			opacity: 1,
			zIndex: 0,
			projectId: 'project-123',
			createdAt: Date.now(),
			updatedAt: Date.now(),
		},
		{
			id: 'layer-2',
			name: 'Foreground',
			visible: true,
			opacity: 0.8,
			zIndex: 1,
			projectId: 'project-123',
			createdAt: Date.now(),
			updatedAt: Date.now(),
		},
	];

	type SelectorFunc<TResult> = (state: RootState, ...args: string[]) => TResult;

	const createMockSelector = <TResult,>(
		impl: SelectorFunc<TResult>,
	): SelectorFunc<TResult> => {
		const selector = (state: RootState, ...args: string[]): TResult =>
			impl(state, ...args);
		Object.assign(selector, {
			resultFunc: impl,
			recomputations: vi.fn(() => 0),
			resetRecomputations: vi.fn(),
		});
		return selector;
	};

	const mockSelectByProjectInstance = createMockSelector<Layer[]>(
		(_state: RootState, projectId: string) => {
			const layers = createMockLayers();
			return layers.filter((l) => l.projectId === projectId);
		},
	);

	const mockSelectActiveLayer = createMockSelector<Layer | null>((state: RootState) => {
		const activeId = state.layers?.activeId;
		if (!activeId) return null;
		const layers = createMockLayers();
		return layers.find((l) => l.id === activeId) ?? null;
	});

	return {
		layersSelectors: {
			selectActiveLayer: mockSelectActiveLayer,
		},
		makeSelectByProject: vi.fn(() => mockSelectByProjectInstance),
	};
});

// ──────────────────────────────
// Setup and tests
// ──────────────────────────────
const mockLayers: Layer[] = [
	{
		id: 'layer-1',
		name: 'Background',
		visible: true,
		opacity: 1,
		zIndex: 0,
		projectId: 'project-123',
		createdAt: Date.now(),
		updatedAt: Date.now(),
	},
	{
		id: 'layer-2',
		name: 'Foreground',
		visible: true,
		opacity: 0.8,
		zIndex: 1,
		projectId: 'project-123',
		createdAt: Date.now(),
		updatedAt: Date.now(),
	},
];

const mockDispatch = vi.fn();

const createMockState = (): RootState =>
	({
		layers: {
			ids: mockLayers.map((l) => l.id),
			entities: Object.fromEntries(mockLayers.map((l) => [l.id, l])),
			activeId: mockLayers[0].id,
			projectId: 'project-123',
			loading: 'succeeded' as const,
			error: null,
		},
		history: {
			isPreview: false,
			stack: [],
			currentIndex: -1,
		},
	}) as Partial<RootState> as unknown as RootState;

type SelectorFunc<TResult> = (state: RootState, ...args: string[]) => TResult;

// ──────────────────────────────
// TESTS
// ──────────────────────────────
describe('LayersPanel (controlled)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(hooks.useAppDispatch).mockReturnValue(mockDispatch as AppDispatch);
		vi.mocked(hooks.useAppSelector).mockImplementation(
			<T,>(selector: (state: RootState) => T): T => {
				const state = createMockState();
				const result = selector(state);
				if (typeof result === 'function') {
					const projectorFunc = result as SelectorFunc<Layer[]>;
					return projectorFunc(state, 'project-123') as T;
				}
				return result;
			},
		);
		mockDispatch.mockImplementation((action: unknown) => action);
	});

	it('dispatches fetchLayersByProject on mount', async () => {
		const { fetchLayersByProject } = await import('@/entities/layer/model/slice');
		mockStoreState = {
			layers: { entities: {} },
			history: { isPreview: false },
		};
		render(<LayersPanel projectId="project-123" open={true} onClose={() => {}} />);
		expect(fetchLayersByProject).toHaveBeenCalledWith('project-123');
		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'layers/fetchLayersByProject',
			payload: 'project-123',
		});
	});

	it('renders panel only when open=true', () => {
		const { rerender } = render(
			<LayersPanel projectId="project-123" open={false} onClose={() => {}} />,
		);
		expect(screen.queryByText('Layers')).not.toBeInTheDocument();

		rerender(<LayersPanel projectId="project-123" open={true} onClose={() => {}} />);
		expect(screen.getByText('Layers')).toBeInTheDocument();
	});

	it('calls onClose when Close button clicked', async () => {
		const mockOnClose = vi.fn();
		render(<LayersPanel projectId="project-123" open={true} onClose={mockOnClose} />);
		const btn = screen.getByRole('button', { name: /close panel/i });
		fireEvent.click(btn);
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('dispatches createLayer when Add Layer clicked', async () => {
		const { createLayer } = await import('@/entities/layer/model/slice');
		render(<LayersPanel projectId="project-123" open={true} onClose={() => {}} />);
		const addBtn = await screen.findByTestId('mock-add-layer-btn');
		fireEvent.click(addBtn);
		expect(createLayer).toHaveBeenCalledWith({ projectId: 'project-123' });
		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'layers/createLayer',
			payload: { projectId: 'project-123' },
		});
	});

	it('renders all layers sorted by zIndex desc', async () => {
		render(<LayersPanel projectId="project-123" open={true} onClose={() => {}} />);
		const items = await screen.findAllByTestId('mock-layer-item');
		expect(items[0]).toHaveAttribute('data-layer-id', 'layer-2');
		expect(items[1]).toHaveAttribute('data-layer-id', 'layer-1');
	});

	it('renders active layer with (active) label', async () => {
		render(<LayersPanel projectId="project-123" open={true} onClose={() => {}} />);
		const active = await screen.findByText(/background.*\(active\)/i);
		expect(active).toBeInTheDocument();
	});

	it('renders opacity slider with active layer opacity', async () => {
		render(<LayersPanel projectId="project-123" open={true} onClose={() => {}} />);
		const opacitySlider = await screen.findByTestId('mock-opacity-slider');
		expect(opacitySlider).toHaveTextContent('Opacity: 1');
	});
});
