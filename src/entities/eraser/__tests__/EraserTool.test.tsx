import { screen } from '@testing-library/react';
import { renderWithStore, type TestRootState } from '@/test-utils';
import { EraserTool } from '@/entities/eraser/model';

describe('EraserTool', () => {
	const base: Partial<TestRootState> = {
		eraser: { active: false, size: 8 },
		editor: {
			activeTool: null,
			paletteOpen: false,
			viewport: { scale: 1, offsetX: 0, offsetY: 0 },
		},
	};

	it('renders eraser tool button', () => {
		renderWithStore(<EraserTool />, { initialState: base });
		expect(screen.getByTestId('eraser-tool-button')).toBeInTheDocument();
	});

	it('shows palette when eraser is active and paletteOpen is true', () => {
		const st: Partial<TestRootState> = {
			...base,
			editor: { ...base.editor!, activeTool: 'eraser', paletteOpen: true },
		};
		renderWithStore(<EraserTool />, { initialState: st });
		expect(screen.getByText(/eraser/i)).toBeInTheDocument();
	});

	it('hides palette when paletteOpen is false', () => {
		const st: Partial<TestRootState> = {
			...base,
			editor: { ...base.editor!, activeTool: 'eraser', paletteOpen: false },
		};
		renderWithStore(<EraserTool />, { initialState: st });
		expect(screen.queryByText(/eraser/i)).not.toBeInTheDocument();
	});
});
