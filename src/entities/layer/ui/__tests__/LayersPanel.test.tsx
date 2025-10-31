import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import * as hooks from '@/store/hooks';
import type { AppDispatch } from '@/store';
import type { Layer } from '@/shared/types';
import { LayersPanel } from '@/entities/layer/ui';
import { createLayer, fetchLayersByProject } from '@/entities/layer/model';

// ─────────────────────────────── MOCK COMPONENTS ───────────────────────────────
vi.mock('@/entities/layer/ui/components', () => {
	type ToggleProps = { open: boolean; setOpen: (open: boolean) => void };
	return {
		AddLayerButton: ({ onCreate }: { onCreate: () => void }) => (
			<button data-testid="mock-add-layer-btn" onClick={onCreate}>
				Mock AddLayerButton
			</button>
		),
		LayerItem: () => <li data-testid="mock-layer-item">Mock LayerItem</li>,
		OpacitySlider: () => (
			<div data-testid="mock-opacity-slider">Mock OpacitySlider</div>
		),
		PanelToggleButton: ({ open, setOpen }: ToggleProps) => (
			<button
				type="button"
				data-testid="mock-toggle-btn"
				aria-label={open ? 'Close Layers Panel' : 'Open Layers Panel'}
				onClick={() => setOpen(!open)}
			>
				Mock Toggle
			</button>
		),
	};
});

// ─────────────────────────────── MOCK HOOKS ───────────────────────────────
vi.mock('@/store/hooks', async (importActual) => {
	const actual = await importActual<typeof hooks>();
	return {
		...actual,
		useAppDispatch: vi.fn(),
		useAppSelector: vi.fn(),
	};
});

vi.mock('@/entities/layer/model/slice', () => ({
	createLayer: vi.fn(() => ({ type: 'mock/createLayer' })),
	deleteLayer: vi.fn(() => ({ type: 'mock/deleteLayer' })),
	updateLayer: vi.fn((payload: unknown) => ({
		type: 'mock/updateLayer',
		payload,
	})),
	setActiveLayerId: vi.fn((id: string) => ({
		type: 'mock/setActiveLayer',
		payload: id,
	})),
	fetchLayersByProject: vi.fn((projectId: string) => ({
		type: 'mock/fetchLayers',
		payload: projectId,
	})),
}));

vi.mock('@/entities/layer/model/selectors', () => ({
	layersSelectors: {
		selectAll: { name: 'selectAll' },
		selectActiveLayer: { name: 'selectActiveLayer' },
	},
}));

// ─────────────────────────────── MOCK DATA ───────────────────────────────
const mockDispatch: AppDispatch = vi.fn() as unknown as AppDispatch;
const mockSetIsOpen = vi.fn();

const mockLayers: Layer[] = [
	{
		id: '1',
		name: 'Background',
		visible: true,
		opacity: 1,
		zIndex: 0,
		projectId: '123',
		createdAt: new Date('2025-10-30').getTime(),
		updatedAt: new Date('2025-10-30').getTime(),
	},
	{
		id: '2',
		name: 'Foreground',
		visible: false,
		opacity: 0.6,
		zIndex: 1,
		projectId: '123',
		createdAt: new Date('2025-10-30').getTime(),
		updatedAt: new Date('2025-10-30').getTime(),
	},
];

// ─────────────────────────────── TESTS ───────────────────────────────
describe('LayersPanel', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(hooks.useAppDispatch).mockReturnValue(mockDispatch);
		vi.mocked(hooks.useAppSelector).mockImplementation((selector) => {
			if (selector.name.includes('selectAll')) return mockLayers;
			if (selector.name.includes('selectActiveLayer')) return mockLayers[0];
			return undefined;
		});
	});

	it('dispatches fetchLayersByProject on mount', () => {
		render(<LayersPanel projectId="123" setIsOpen={mockSetIsOpen} />);
		expect(fetchLayersByProject).toHaveBeenCalledWith('123');
		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'mock/fetchLayers',
			payload: '123',
		});
	});

	it('renders toggle button (panel closed by default)', () => {
		render(<LayersPanel projectId="123" setIsOpen={mockSetIsOpen} />);
		const btn = screen.getByRole('button', { name: /open layers panel/i });
		expect(btn).toBeInTheDocument();
	});

	it('opens and closes the panel', () => {
		render(<LayersPanel projectId="123" setIsOpen={mockSetIsOpen} />);
		fireEvent.click(screen.getByRole('button', { name: /open layers panel/i }));
		expect(screen.getByText(/layers/i)).toBeInTheDocument();
		fireEvent.click(screen.getByRole('button', { name: /close layers panel/i }));
		expect(screen.queryByText(/layers/i)).not.toBeInTheDocument();
	});

	it('dispatches createLayer when Add Layer clicked', () => {
		render(<LayersPanel projectId="123" setIsOpen={mockSetIsOpen} />);
		fireEvent.click(screen.getByRole('button', { name: /open layers panel/i }));
		const addBtn = screen.getByTestId('mock-add-layer-btn');
		fireEvent.click(addBtn);
		expect(createLayer).toHaveBeenCalledWith({ projectId: '123' });
		expect(mockDispatch).toHaveBeenCalled();
	});

	it('renders layer list via LayerItem mock', () => {
		render(<LayersPanel projectId="123" setIsOpen={mockSetIsOpen} />);
		fireEvent.click(screen.getByRole('button', { name: /open layers panel/i }));
		const items = screen.getAllByTestId('mock-layer-item');
		expect(items).toHaveLength(2);
	});
});
