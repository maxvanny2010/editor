import { fireEvent, screen } from '@testing-library/react';
import { renderWithStore, type TestRootState } from '@/test-utils';
import { BrushTool } from '@/entities/brush/model';

describe('BrushTool', () => {
	const initialState = {
		brush: { color: '#111827', size: 4, isDrawing: false },
		editor: {
			activeTool: null,
			viewport: { scale: 1, offsetX: 0, offsetY: 0 },
		},
	} satisfies Partial<TestRootState>;

	it('renders brush tool button', () => {
		renderWithStore(<BrushTool />, { initialState });
		expect(screen.getByTestId('brush-tool-button')).toBeInTheDocument();
	});

	it('toggles palette visibility when clicked', () => {
		renderWithStore(<BrushTool />, { initialState });
		const button = screen.getByTestId('brush-tool-button');

		fireEvent.click(button);
		expect(screen.getByText(/brush/i)).toBeInTheDocument();

		fireEvent.click(button);
		expect(screen.queryByText(/brush/i)).not.toBeInTheDocument();
	});
});
