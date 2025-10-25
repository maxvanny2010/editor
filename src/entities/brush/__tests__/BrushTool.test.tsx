import { screen } from '@testing-library/react';
import { renderWithStore, type TestRootState } from '@/test-utils';
import { BrushTool } from '@/entities/brush/model';

describe('BrushTool', () => {
	const baseState: Partial<TestRootState> = {
		brush: { color: '#111827', size: 4, isDrawing: false },
		editor: {
			activeTool: null,
			paletteOpen: false,
			viewport: { scale: 1, offsetX: 0, offsetY: 0 },
		},
	};

	it('renders brush tool button', () => {
		renderWithStore(<BrushTool />, { initialState: baseState });
		expect(screen.getByTestId('brush-tool-button')).toBeInTheDocument();
	});

	it('shows palette when brush is active and paletteOpen is true', () => {
		const state: Partial<TestRootState> = {
			...baseState,
			editor: {
				activeTool: 'brush',
				paletteOpen: true,
				viewport: { scale: 1, offsetX: 0, offsetY: 0 },
			},
		};
		renderWithStore(<BrushTool />, { initialState: state });
		expect(screen.getByText(/brush/i)).toBeInTheDocument();
	});

	it('hides palette when paletteOpen is false', () => {
		const state: Partial<TestRootState> = {
			...baseState,
			editor: {
				activeTool: 'brush',
				paletteOpen: false,
				viewport: { scale: 1, offsetX: 0, offsetY: 0 },
			},
		};
		renderWithStore(<BrushTool />, { initialState: state });
		expect(screen.queryByText(/brush/i)).not.toBeInTheDocument();
	});
});
