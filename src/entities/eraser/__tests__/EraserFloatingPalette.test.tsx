import { fireEvent, screen } from '@testing-library/react';
import { renderWithStore, type TestRootState } from '@/test-utils';
import { EraserFloatingPalette } from '@/entities/eraser/model';

describe('EraserFloatingPalette', () => {
	const initialState: Partial<TestRootState> = {
		eraser: { active: false, size: 8 },
		editor: {
			activeTool: 'eraser',
			paletteOpen: true,
			viewport: { scale: 1, offsetX: 0, offsetY: 0 },
		},
	};

	it('renders size buttons', () => {
		renderWithStore(<EraserFloatingPalette />, { initialState });
		const sizeButtons = screen.getAllByTestId(/eraser-value-/i);
		expect(sizeButtons.length).toBeGreaterThan(3);
	});

	it('highlights selected size when clicked', () => {
		renderWithStore(<EraserFloatingPalette />, { initialState });
		const btn = screen.getByTestId('eraser-value-12');
		fireEvent.click(btn);
		expect(btn.className).toContain('ring-2');
	});
});
