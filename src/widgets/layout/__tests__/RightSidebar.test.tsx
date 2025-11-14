import { fireEvent, render, screen } from '@testing-library/react';
import { RightSidebar } from '@/widgets/layout/ui';

describe('RightSidebar', () => {
	const mockOnSelect = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders sidebar with all buttons', () => {
			render(<RightSidebar active={null} onSelect={mockOnSelect} />);

			expect(screen.getByTitle('Layers')).toBeInTheDocument();
			expect(screen.getByTitle('History')).toBeInTheDocument();
		});

		it('renders correct icons for each button', () => {
			render(<RightSidebar active={null} onSelect={mockOnSelect} />);

			expect(screen.getByTestId('layers-icon')).toBeInTheDocument();
			expect(screen.getByTestId('history-icon')).toBeInTheDocument();
		});

		it('renders with correct sidebar styling', () => {
			const { container } = render(
				<RightSidebar active={null} onSelect={mockOnSelect} />,
			);

			const sidebar = container.querySelector('aside');
			expect(sidebar).toHaveClass('fixed', 'right-0', 'bg-gray-900', 'z-50');
		});
	});

	describe('Active State', () => {
		it('applies active styling to layers button when active', () => {
			render(<RightSidebar active="layers" onSelect={mockOnSelect} />);

			const layersButton = screen.getByTitle('Layers');
			expect(layersButton).toHaveClass('bg-indigo-600');
		});

		it('applies active styling to history button when active', () => {
			render(<RightSidebar active="history" onSelect={mockOnSelect} />);

			const historyButton = screen.getByTitle('History');
			expect(historyButton).toHaveClass('bg-amber-600');
		});

		it('applies inactive styling when no panel is active', () => {
			render(<RightSidebar active={null} onSelect={mockOnSelect} />);

			const layersButton = screen.getByTitle('Layers');
			const historyButton = screen.getByTitle('History');

			expect(layersButton).toHaveClass('bg-gray-700');
			expect(historyButton).toHaveClass('bg-gray-700');
		});

		it('sets aria-pressed to true for active button', () => {
			render(<RightSidebar active="layers" onSelect={mockOnSelect} />);

			const layersButton = screen.getByTitle('Layers');
			expect(layersButton).toHaveAttribute('aria-pressed', 'true');
		});

		it('sets aria-pressed to false for inactive button', () => {
			render(<RightSidebar active="history" onSelect={mockOnSelect} />);

			const layersButton = screen.getByTitle('Layers');
			expect(layersButton).toHaveAttribute('aria-pressed', 'false');
		});
	});

	describe('Toggle Behavior', () => {
		it('calls onSelect with "layers" when layers button clicked from null', () => {
			render(<RightSidebar active={null} onSelect={mockOnSelect} />);

			fireEvent.click(screen.getByTitle('Layers'));

			expect(mockOnSelect).toHaveBeenCalledTimes(1);
			expect(mockOnSelect).toHaveBeenCalledWith('layers');
		});

		it('calls onSelect with null when active layers button clicked', () => {
			render(<RightSidebar active="layers" onSelect={mockOnSelect} />);

			fireEvent.click(screen.getByTitle('Layers'));

			expect(mockOnSelect).toHaveBeenCalledTimes(1);
			expect(mockOnSelect).toHaveBeenCalledWith(null);
		});

		it('calls onSelect with "history" when history button clicked from null', () => {
			render(<RightSidebar active={null} onSelect={mockOnSelect} />);

			fireEvent.click(screen.getByTitle('History'));

			expect(mockOnSelect).toHaveBeenCalledTimes(1);
			expect(mockOnSelect).toHaveBeenCalledWith('history');
		});

		it('calls onSelect with null when active history button clicked', () => {
			render(<RightSidebar active="history" onSelect={mockOnSelect} />);

			fireEvent.click(screen.getByTitle('History'));

			expect(mockOnSelect).toHaveBeenCalledTimes(1);
			expect(mockOnSelect).toHaveBeenCalledWith(null);
		});

		it('switches from layers to history when history clicked', () => {
			render(<RightSidebar active="layers" onSelect={mockOnSelect} />);

			fireEvent.click(screen.getByTitle('History'));

			expect(mockOnSelect).toHaveBeenCalledTimes(1);
			expect(mockOnSelect).toHaveBeenCalledWith('history');
		});

		it('switches from history to layers when layers clicked', () => {
			render(<RightSidebar active="history" onSelect={mockOnSelect} />);

			fireEvent.click(screen.getByTitle('Layers'));

			expect(mockOnSelect).toHaveBeenCalledTimes(1);
			expect(mockOnSelect).toHaveBeenCalledWith('layers');
		});
	});

	describe('Multiple Interactions', () => {
		it('does not call onSelect multiple times on single click', () => {
			render(<RightSidebar active={null} onSelect={mockOnSelect} />);

			fireEvent.click(screen.getByTitle('Layers'));

			expect(mockOnSelect).toHaveBeenCalledTimes(1);
		});

		it('handles rapid toggle correctly', () => {
			render(<RightSidebar active={null} onSelect={mockOnSelect} />);

			const layersButton = screen.getByTitle('Layers');

			fireEvent.click(layersButton);
			fireEvent.click(layersButton);
			fireEvent.click(layersButton);

			expect(mockOnSelect).toHaveBeenCalledTimes(3);
			expect(mockOnSelect).toHaveBeenNthCalledWith(1, 'layers');
			expect(mockOnSelect).toHaveBeenNthCalledWith(2, 'layers');
			expect(mockOnSelect).toHaveBeenNthCalledWith(3, 'layers');
		});
	});

	describe('Visual Feedback', () => {
		it('shows active indicator for active panel', () => {
			const { container } = render(
				<RightSidebar active="layers" onSelect={mockOnSelect} />,
			);

			const indicator = container.querySelector('span.ring-2.ring-white\\/30');
			expect(indicator).toBeInTheDocument();
		});

		it('does not show indicator when no panel is active', () => {
			const { container } = render(
				<RightSidebar active={null} onSelect={mockOnSelect} />,
			);

			const indicator = container.querySelector('span.ring-2.ring-white\\/30');
			expect(indicator).not.toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('has correct title attributes', () => {
			render(<RightSidebar active={null} onSelect={mockOnSelect} />);

			expect(screen.getByTitle('Layers')).toBeInTheDocument();
			expect(screen.getByTitle('History')).toBeInTheDocument();
		});

		it('buttons are keyboard accessible', () => {
			render(<RightSidebar active={null} onSelect={mockOnSelect} />);

			const layersButton = screen.getByTitle('Layers');
			expect(layersButton.tagName).toBe('BUTTON');
		});
	});
});
