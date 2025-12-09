import { render } from '@testing-library/react';
import { RightSidebarSkeleton } from '@/widgets/widgets/editor/ui';

describe('RightSidebarSkeleton', () => {
	it('renders sidebar in correct position', () => {
		const { container } = render(<RightSidebarSkeleton />);

		const sidebar = container.querySelector('.absolute.right-0');
		expect(sidebar).toBeInTheDocument();
		expect(sidebar).toHaveClass('top-0', 'h-full', 'w-60');
	});

	it('renders 4 skeleton lines', () => {
		const { container } = render(<RightSidebarSkeleton />);

		const lines = container.querySelectorAll('.h-6.w-full');
		expect(lines).toHaveLength(4);
	});

	it('applies pulsing animation to container', () => {
		const { container } = render(<RightSidebarSkeleton />);

		const animatedContainer = container.querySelector('.animate-pulse');
		expect(animatedContainer).toBeInTheDocument();
	});
});
