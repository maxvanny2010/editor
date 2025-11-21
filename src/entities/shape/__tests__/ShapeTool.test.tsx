import { screen } from '@testing-library/react';
import { renderWithStore, type TestRootState } from '@/test-utils';
import { ShapeTool } from '@/entities/shape/model';

describe('ShapeTool', () => {
	const baseState: Partial<TestRootState> = {
		shape: {
			active: false,
			type: 'rect',
			fill: '#ffffff',
			stroke: '#000000',
			thickness: 2,
		},
		editor: {
			activeTool: null,
			paletteOpen: false,
			viewport: { scale: 1, offsetX: 0, offsetY: 0 },
		},
	};

	it('renders shape tool button', () => {
		renderWithStore(<ShapeTool />, { initialState: baseState });
		expect(screen.getByTestId('shape-tool-button')).toBeInTheDocument();
	});

	it('shows palette when shape is active and paletteOpen is true', () => {
		const state: Partial<TestRootState> = {
			...baseState,
			editor: {
				activeTool: 'shape',
				paletteOpen: true,
				viewport: { scale: 1, offsetX: 0, offsetY: 0 },
			},
		};
		renderWithStore(<ShapeTool />, { initialState: state });

		expect(screen.getByText(/shape tool/i)).toBeInTheDocument();
	});

	it('hides palette when paletteOpen is false', () => {
		const state: Partial<TestRootState> = {
			...baseState,
			editor: {
				activeTool: 'shape',
				paletteOpen: false,
				viewport: { scale: 1, offsetX: 0, offsetY: 0 },
			},
		};
		renderWithStore(<ShapeTool />, { initialState: state });
		expect(screen.queryByText(/shape tool/i)).not.toBeInTheDocument();
	});
});
