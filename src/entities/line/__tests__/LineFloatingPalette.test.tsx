import { fireEvent, screen } from '@testing-library/react';
import { LineFloatingPalette } from '@/entities/line/model';
import { renderWithStore, type TestRootState } from '@/test-utils';

describe('LineFloatingPalette', () => {
	const initialState: Partial<TestRootState> = {
		line: { active: false, color: '#111827', thickness: 4 },
		editor: {
			activeTool: 'line',
			paletteOpen: true,
			viewport: { scale: 1, offsetX: 0, offsetY: 0 },
		},
	};

	it('renders all line thickness buttons', () => {
		renderWithStore(<LineFloatingPalette />, { initialState });
		const thicknessButtons = screen.getAllByTestId(/line-value-/i);
		expect(thicknessButtons.length).toBeGreaterThan(3);
	});

	it('highlights the selected thickness when clicked', () => {
		renderWithStore(<LineFloatingPalette />, { initialState });
		const thickButton = screen.getByTestId('line-value-8');
		fireEvent.click(thickButton);
		expect(thickButton.className).toContain('ring-2');
	});

	it('highlights the selected color when clicked', () => {
		renderWithStore(<LineFloatingPalette />, { initialState });
		const redButton = screen.getByTestId('line-color-#EF4444');
		fireEvent.click(redButton);
		expect(redButton.className).toContain('ring-2');
	});

	it('handles color input change', () => {
		renderWithStore(<LineFloatingPalette />, { initialState });
		const colorInput = screen.getByTestId('line-input-color') as HTMLInputElement;
		fireEvent.change(colorInput, { target: { value: '#00ff00' } });
		expect(colorInput.value).toBe('#00ff00');
	});
});
