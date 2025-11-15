import { render } from '@testing-library/react';
import { LeftToolbarSkeleton } from '@/entities/editor/ui';

describe('LeftToolbarSkeleton', () => {
	it('renders toolbar in correct position', () => {
		const { container } = render(<LeftToolbarSkeleton />);

		const toolbar = container.querySelector('.absolute.top-1\\/2');
		expect(toolbar).toBeInTheDocument();
		expect(toolbar).toHaveClass('left-4', '-translate-y-1/2');
	});

	it('renders 5 toolbar items', () => {
		const { container } = render(<LeftToolbarSkeleton />);

		const items = container.querySelectorAll('.animate-pulse');
		expect(items).toHaveLength(5);
	});

	it('applies correct styling to toolbar items', () => {
		const { container } = render(<LeftToolbarSkeleton />);

		const items = container.querySelectorAll('.animate-pulse');
		items.forEach((item) => {
			expect(item).toHaveClass('w-12', 'h-12', 'rounded-xl');
		});
	});
});
