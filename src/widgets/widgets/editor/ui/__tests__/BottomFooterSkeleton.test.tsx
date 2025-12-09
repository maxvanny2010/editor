import { render } from '@testing-library/react';
import { BottomFooterSkeleton } from '@/widgets/widgets/editor/ui';

describe('BottomFooterSkeleton', () => {
	it('renders skeleton with correct structure', () => {
		const { container } = render(<BottomFooterSkeleton />);

		const footer = container.querySelector('.absolute.bottom-0');
		expect(footer).toBeInTheDocument();
		expect(footer).toHaveClass('border-t', 'bg-gray-50/70', 'dark:bg-gray-800/70');
	});

	it('renders 5 skeleton items', () => {
		const { container } = render(<BottomFooterSkeleton />);

		const items = container.querySelectorAll('.animate-pulse');
		expect(items).toHaveLength(5);
	});

	it('applies correct styling to skeleton items', () => {
		const { container } = render(<BottomFooterSkeleton />);

		const items = container.querySelectorAll('.animate-pulse');
		items.forEach((item) => {
			expect(item).toHaveClass(
				'w-8',
				'h-8',
				'rounded-md',
				'bg-gray-200',
				'dark:bg-gray-700',
			);
		});
	});
});
