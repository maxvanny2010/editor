import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { forwardRef } from 'react';
import * as hooks from '@/store/hooks';
import type { AppDispatch, RootState } from '@/store';
import type { Layer } from '@/shared/types';
import { LayersPanel } from '@/entities/layer/ui';

vi.mock('@/entities/layer/ui/components', () => {
	type ToggleProps = { open: boolean; setOpen: (open: boolean) => void };
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

		PanelToggleButton: ({ open, setOpen }: ToggleProps) => (
			<button
				type="button"
				data-testid="mock-toggle-btn"
				aria-label={open ? 'Close Layers Panel' : 'Open Layers Panel'}
				onClick={() => setOpen(!open)}
			>
				{open ? 'Close' : 'Open'} Panel
			</button>
		),
	};
});

vi.mock('@/store/hooks', () => ({
	useAppDispatch: vi.fn(),
	useAppSelector: vi.fn(),
}));

vi.mock('@/entities/layer/model/slice', () => ({
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
}));

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
		const selector = (state: RootState, ...args: string[]): TResult => {
			return impl(state, ...args);
		};

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
			selectAll: vi.fn(),
			selectActiveLayer: mockSelectActiveLayer,
			selectLoading: vi.fn(),
			selectError: vi.fn(),
			selectByProject: vi.fn(),
		},
		makeSelectByProject: vi.fn(() => mockSelectByProjectInstance),
	};
});

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
const mockSetIsOpen = vi.fn();

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
	}) as RootState;

type SelectorFunc<TResult> = (state: RootState, ...args: string[]) => TResult;

describe('LayersPanel', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(hooks.useAppDispatch).mockReturnValue(mockDispatch as AppDispatch);
		vi.mocked(hooks.useAppSelector).mockImplementation(
			<T,>(selector: (state: RootState) => T): T => {
				const state = createMockState();
				if (typeof selector === 'function') {
					const result = selector(state);
					if (typeof result === 'function') {
						const projectorFunc = result as SelectorFunc<Layer[]>;
						return projectorFunc(state, 'project-123') as T;
					}
					return result;
				}
				return undefined as T;
			},
		);
		mockDispatch.mockImplementation((action: unknown) => action);
	});

	it('dispatches fetchLayersByProject on mount', async () => {
		const { fetchLayersByProject } = await import('@/entities/layer/model/slice');
		render(<LayersPanel projectId="project-123" setIsOpen={mockSetIsOpen} />);
		expect(fetchLayersByProject).toHaveBeenCalledWith('project-123');
		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'layers/fetchLayersByProject',
			payload: 'project-123',
		});
	});

	it('renders toggle button (panel closed by default)', () => {
		render(<LayersPanel projectId="project-123" setIsOpen={mockSetIsOpen} />);
		const btn = screen.getByRole('button', { name: /open layers panel/i });
		expect(btn).toBeInTheDocument();
		expect(btn).toHaveTextContent('Open Panel');
	});

	it('opens and closes the panel', async () => {
		render(<LayersPanel projectId="project-123" setIsOpen={mockSetIsOpen} />);
		const openBtn = screen.getByRole('button', { name: /open layers panel/i });
		fireEvent.click(openBtn);
		await waitFor(() => {
			expect(screen.getByText(/layers/i)).toBeInTheDocument();
		});
		expect(mockSetIsOpen).toHaveBeenCalledWith(true);
		const closeBtn = screen.getByRole('button', { name: /close layers panel/i });
		fireEvent.click(closeBtn);
		await waitFor(() => {
			expect(screen.queryByText(/layers/i)).not.toBeInTheDocument();
		});
		expect(mockSetIsOpen).toHaveBeenCalledWith(false);
	});

	it('dispatches createLayer when Add Layer clicked', async () => {
		const { createLayer } = await import('@/entities/layer/model/slice');
		render(<LayersPanel projectId="project-123" setIsOpen={mockSetIsOpen} />);
		fireEvent.click(screen.getByRole('button', { name: /open layers panel/i }));
		await waitFor(() => {
			expect(screen.getByTestId('mock-add-layer-btn')).toBeInTheDocument();
		});
		const addBtn = screen.getByTestId('mock-add-layer-btn');
		fireEvent.click(addBtn);
		expect(createLayer).toHaveBeenCalledWith({ projectId: 'project-123' });
		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'layers/createLayer',
			payload: { projectId: 'project-123' },
		});
	});

	it('renders layer list via LayerItem mock', async () => {
		render(<LayersPanel projectId="project-123" setIsOpen={mockSetIsOpen} />);
		fireEvent.click(screen.getByRole('button', { name: /open layers panel/i }));
		await waitFor(() => {
			const items = screen.getAllByTestId('mock-layer-item');
			expect(items).toHaveLength(2);
		});
		const items = screen.getAllByTestId('mock-layer-item');
		expect(items[0]).toHaveTextContent('Foreground');
		expect(items[1]).toHaveTextContent('Background');
	});

	it('displays active layer correctly', async () => {
		render(<LayersPanel projectId="project-123" setIsOpen={mockSetIsOpen} />);
		fireEvent.click(screen.getByRole('button', { name: /open layers panel/i }));
		await waitFor(() => {
			const activeItem = screen.getByText(/background.*\(active\)/i);
			expect(activeItem).toBeInTheDocument();
		});
	});

	it('renders opacity slider with active layer opacity', async () => {
		render(<LayersPanel projectId="project-123" setIsOpen={mockSetIsOpen} />);
		fireEvent.click(screen.getByRole('button', { name: /open layers panel/i }));
		await waitFor(() => {
			const opacitySlider = screen.getByTestId('mock-opacity-slider');
			expect(opacitySlider).toHaveTextContent('Opacity: 1');
		});
	});

	it('calls setIsOpen callback when panel state changes', async () => {
		render(<LayersPanel projectId="project-123" setIsOpen={mockSetIsOpen} />);
		fireEvent.click(screen.getByRole('button', { name: /open layers panel/i }));
		await waitFor(() => {
			expect(mockSetIsOpen).toHaveBeenCalledWith(true);
		});
		const closeButton = screen.getByRole('button', { name: /close panel/i });
		fireEvent.click(closeButton);
		await waitFor(() => {
			expect(mockSetIsOpen).toHaveBeenCalledWith(false);
		});
	});

	it('sorts layers by zIndex in descending order', async () => {
		render(<LayersPanel projectId="project-123" setIsOpen={mockSetIsOpen} />);
		fireEvent.click(screen.getByRole('button', { name: /open layers panel/i }));
		await waitFor(() => {
			const items = screen.getAllByTestId('mock-layer-item');
			expect(items[0]).toHaveAttribute('data-layer-id', 'layer-2');
			expect(items[1]).toHaveAttribute('data-layer-id', 'layer-1');
		});
	});

	it('uses memoized selector from makeSelectByProject', async () => {
		const { makeSelectByProject } = await import('@/entities/layer/model/selectors');
		render(<LayersPanel projectId="project-123" setIsOpen={mockSetIsOpen} />);
		expect(makeSelectByProject).toHaveBeenCalled();
		fireEvent.click(screen.getByRole('button', { name: /open layers panel/i }));
		const items = screen.getAllByTestId('mock-layer-item');
		expect(items).toHaveLength(2);
	});
});
