import { fireEvent, render, screen } from '@testing-library/react';
import { BottomFooter } from '@/widgets/layout/ui';

describe('BottomFooter', () => {
	const defaultProps = {
		scale: 1,
		offsetX: 0,
		offsetY: 0,
		onReset: vi.fn(),
		onFit: vi.fn(),
		onToggleGrid: vi.fn(),
		showGrid: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders footer with correct zoom and offset display', () => {
		render(<BottomFooter {...defaultProps} />);

		expect(screen.getByText(/Zoom: 100%/)).toBeInTheDocument();
		expect(screen.getByText(/Offset: 0, 0/)).toBeInTheDocument();
	});

	it('displays correct zoom percentage when scale changes', () => {
		render(<BottomFooter {...defaultProps} scale={1.5} />);

		expect(screen.getByText(/Zoom: 150%/)).toBeInTheDocument();
	});

	it('displays correct offset values', () => {
		render(<BottomFooter {...defaultProps} offsetX={100} offsetY={-50} />);

		expect(screen.getByText(/Offset: 100, -50/)).toBeInTheDocument();
	});

	it('renders all control buttons', () => {
		render(<BottomFooter {...defaultProps} onUndo={vi.fn()} onRedo={vi.fn()} />);

		expect(screen.getByTestId('undo-button-testid')).toBeInTheDocument();
		expect(screen.getByTestId('redo-button-testid')).toBeInTheDocument();
		expect(screen.getByTestId('fit-button-testid')).toBeInTheDocument();
		expect(screen.getByTestId('reset-button-testid')).toBeInTheDocument();
		expect(screen.getByTestId('grid-button-testid')).toBeInTheDocument();
	});

	it('renders undo button when onUndo is provided', () => {
		const onUndo = vi.fn();
		render(<BottomFooter {...defaultProps} onUndo={onUndo} />);

		expect(screen.getByTestId('undo-button-testid')).toBeInTheDocument();
	});

	it('renders redo button when onRedo is provided', () => {
		const onRedo = vi.fn();
		render(<BottomFooter {...defaultProps} onRedo={onRedo} />);

		expect(screen.getByTestId('redo-button-testid')).toBeInTheDocument();
	});

	it('calls onUndo when undo button is clicked', () => {
		const onUndo = vi.fn();
		render(<BottomFooter {...defaultProps} onUndo={onUndo} />);

		fireEvent.click(screen.getByTestId('undo-button-testid'));

		expect(onUndo).toHaveBeenCalledTimes(1);
	});

	it('calls onRedo when redo button is clicked', () => {
		const onRedo = vi.fn();
		render(<BottomFooter {...defaultProps} onRedo={onRedo} />);

		fireEvent.click(screen.getByTestId('redo-button-testid'));

		expect(onRedo).toHaveBeenCalledTimes(1);
	});

	it('calls onReset when reset button is clicked', () => {
		const onReset = vi.fn();
		render(<BottomFooter {...defaultProps} onReset={onReset} />);

		fireEvent.click(screen.getByTestId('reset-button-testid'));

		expect(onReset).toHaveBeenCalledTimes(1);
	});

	it('calls onFit when fit button is clicked', () => {
		const onFit = vi.fn();
		render(<BottomFooter {...defaultProps} onFit={onFit} />);

		fireEvent.click(screen.getByTestId('fit-button-testid'));

		expect(onFit).toHaveBeenCalledTimes(1);
	});

	it('calls onToggleGrid when grid button is clicked', () => {
		const onToggleGrid = vi.fn();
		render(<BottomFooter {...defaultProps} onToggleGrid={onToggleGrid} />);

		fireEvent.click(screen.getByTestId('grid-button-testid'));

		expect(onToggleGrid).toHaveBeenCalledTimes(1);
	});

	it('displays "Show Grid" label when grid is hidden', () => {
		render(<BottomFooter {...defaultProps} showGrid={false} />);

		expect(screen.getByText('Show Grid')).toBeInTheDocument();
	});

	it('displays "Hide Grid" label when grid is shown', () => {
		render(<BottomFooter {...defaultProps} showGrid={true} />);

		expect(screen.getByText('Hide Grid')).toBeInTheDocument();
	});

	it('passes active state to grid button when showGrid is true', () => {
		render(<BottomFooter {...defaultProps} showGrid={true} />);

		const gridButton = screen.getByTestId('grid-button-testid');
		expect(gridButton).toHaveClass('bg-indigo-600');
	});

	it('grid button is not active when showGrid is false', () => {
		render(<BottomFooter {...defaultProps} showGrid={false} />);

		const gridButton = screen.getByTestId('grid-button-testid');
		expect(gridButton).toHaveClass('bg-gray-700/60');
	});

	it('formats decimal zoom values correctly', () => {
		render(<BottomFooter {...defaultProps} scale={0.756} />);

		expect(screen.getByText(/Zoom: 76%/)).toBeInTheDocument();
	});

	it('handles negative offset values', () => {
		render(<BottomFooter {...defaultProps} offsetX={-200} offsetY={-150} />);

		expect(screen.getByText(/Offset: -200, -150/)).toBeInTheDocument();
	});

	it('renders with correct footer styling classes', () => {
		const { container } = render(<BottomFooter {...defaultProps} />);

		const footer = container.querySelector('footer');
		expect(footer).toHaveClass('fixed', 'bottom-0', 'bg-gray-900', 'z-50');
	});

	it('does not call handlers multiple times on single click', () => {
		const onReset = vi.fn();
		const onFit = vi.fn();
		const onToggleGrid = vi.fn();

		render(
			<BottomFooter
				{...defaultProps}
				onReset={onReset}
				onFit={onFit}
				onToggleGrid={onToggleGrid}
			/>,
		);

		fireEvent.click(screen.getByTestId('reset-button-testid'));
		fireEvent.click(screen.getByTestId('fit-button-testid'));
		fireEvent.click(screen.getByTestId('grid-button-testid'));

		expect(onReset).toHaveBeenCalledTimes(1);
		expect(onFit).toHaveBeenCalledTimes(1);
		expect(onToggleGrid).toHaveBeenCalledTimes(1);
	});

	it('renders all required buttons without undo/redo', () => {
		render(<BottomFooter {...defaultProps} />);

		expect(screen.getByTestId('fit-button-testid')).toBeInTheDocument();
		expect(screen.getByTestId('reset-button-testid')).toBeInTheDocument();
		expect(screen.getByTestId('grid-button-testid')).toBeInTheDocument();
		expect(screen.getByTestId('undo-button-testid')).toBeInTheDocument();
		expect(screen.getByTestId('redo-button-testid')).toBeInTheDocument();
	});

	it('handles large zoom values correctly', () => {
		render(<BottomFooter {...defaultProps} scale={10.5} />);

		expect(screen.getByText(/Zoom: 1050%/)).toBeInTheDocument();
	});

	it('handles small zoom values correctly', () => {
		render(<BottomFooter {...defaultProps} scale={0.1} />);

		expect(screen.getByText(/Zoom: 10%/)).toBeInTheDocument();
	});
});
