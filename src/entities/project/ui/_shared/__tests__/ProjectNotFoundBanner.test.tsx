import { render, screen, waitFor } from '@testing-library/react';
import { ProjectNotFoundBanner } from '@/entities/project/ui/_shared';

describe('ProjectNotFoundBanner', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders banner when show is true', () => {
		render(<ProjectNotFoundBanner show={true} onHide={vi.fn()} />);

		expect(screen.getByText('Project not found')).toBeInTheDocument();
	});

	it('does not render banner when show is false', () => {
		render(<ProjectNotFoundBanner show={false} onHide={vi.fn()} />);

		expect(screen.queryByText('Project not found')).not.toBeInTheDocument();
	});

	it('calls onHide after 2 seconds', () => {
		const onHide = vi.fn();

		render(<ProjectNotFoundBanner show={true} onHide={onHide} />);

		expect(onHide).not.toHaveBeenCalled();

		vi.advanceTimersByTime(2000);

		expect(onHide).toHaveBeenCalledTimes(1);
	});

	it('applies correct styling classes', () => {
		const { container } = render(
			<ProjectNotFoundBanner show={true} onHide={vi.fn()} />,
		);

		const banner = container.querySelector('.fixed');
		expect(banner).toHaveClass(
			'left-1/2',
			'top-4',
			'-translate-x-1/2',
			'z-[2000]',
			'rounded-xl',
			'shadow-lg',
			'backdrop-blur-md',
			'bg-rose-500/90',
			'text-white',
		);
	});

	it('has correct z-index for overlay', () => {
		const { container } = render(
			<ProjectNotFoundBanner show={true} onHide={vi.fn()} />,
		);

		const banner = container.querySelector('.z-\\[2000\\]');
		expect(banner).toBeInTheDocument();
	});

	it('handles rapid show/hide toggling', () => {
		const onHide = vi.fn();

		const { rerender } = render(
			<ProjectNotFoundBanner show={true} onHide={onHide} />,
		);

		vi.advanceTimersByTime(1000);

		rerender(<ProjectNotFoundBanner show={false} onHide={onHide} />);

		vi.advanceTimersByTime(1000);

		expect(onHide).not.toHaveBeenCalled();
	});

	it('handles animation exit', async () => {
		// Use real timers for framer-motion animations
		vi.useRealTimers();

		const { rerender } = render(
			<ProjectNotFoundBanner show={true} onHide={vi.fn()} />,
		);

		expect(screen.getByText('Project not found')).toBeInTheDocument();

		rerender(<ProjectNotFoundBanner show={false} onHide={vi.fn()} />);

		// AnimatePresence should handle exit animation
		await waitFor(
			() => {
				expect(screen.queryByText('Project not found')).not.toBeInTheDocument();
			},
			{ timeout: 1000 },
		);
	});
});
