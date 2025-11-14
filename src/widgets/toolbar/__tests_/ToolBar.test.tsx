import { render, screen } from '@testing-library/react';
import { ToolBar } from '@/widgets/toolbar/ui';

describe('ToolBar', () => {
	it('renders children correctly', () => {
		render(
			<ToolBar position="bottom">
				<button data-testid="child-btn">Brush</button>
			</ToolBar>,
		);

		expect(screen.getByTestId('child-btn')).toBeInTheDocument();
	});

	it('applies correct position classes', () => {
		const { rerender } = render(<ToolBar position="bottom">x</ToolBar>);
		const toolbar = screen.getByRole('toolbar');
		expect(toolbar.className).toContain('bottom-4');

		rerender(<ToolBar position="left">x</ToolBar>);
		expect(toolbar.className).toContain('left-4');
	});
});
