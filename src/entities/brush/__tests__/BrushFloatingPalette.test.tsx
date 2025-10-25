import { fireEvent, screen } from '@testing-library/react';
import { BrushFloatingPalette } from '@/entities/brush/model';
import { renderWithStore, type TestRootState } from '@/test-utils';

describe('BrushFloatingPalette', () => {
	const initialState: Partial<TestRootState> = {
		brush: { color: '#111827', size: 4, isDrawing: false },
		editor: {
			activeTool: 'brush',
			paletteOpen: true,
			viewport: { scale: 1, offsetX: 0, offsetY: 0 },
		},
	};

	it('renders all brush size buttons', () => {
		renderWithStore(<BrushFloatingPalette />, { initialState });
		const sizeButtons = screen.getAllByTestId(/brush-size-/i);
		expect(sizeButtons.length).toBeGreaterThan(3);
	});

	it('highlights the selected size when clicked', () => {
		renderWithStore(<BrushFloatingPalette />, { initialState });
		const sizeButton = screen.getByTestId('brush-size-8');
		fireEvent.click(sizeButton);
		expect(sizeButton.className).toContain('ring-2');
	});

	it('highlights the selected color when clicked', () => {
		renderWithStore(<BrushFloatingPalette />, { initialState });
		const redButton = screen.getByTestId('brush-color-#EF4444');
		fireEvent.click(redButton);
		expect(redButton.className).toContain('ring-2');
	});

	it('handles color input change', () => {
		renderWithStore(<BrushFloatingPalette />, { initialState });
		const colorInput = screen.getByTestId('brush-input-color') as HTMLInputElement;
		fireEvent.change(colorInput, { target: { value: '#ffffff' } });
		expect(colorInput.value).toBe('#ffffff');
	});
});
