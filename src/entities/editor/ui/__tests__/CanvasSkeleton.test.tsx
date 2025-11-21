import { render } from '@testing-library/react';
import { CanvasSkeleton } from '@/entities/editor/ui';

describe('CanvasSkeleton', () => {
	it('renders with animation wrapper', () => {
		const { container } = render(<CanvasSkeleton />);

		const canvas = container.querySelector('.flex-1');
		expect(canvas).toBeInTheDocument();
	});

	it('renders animated skeleton box', () => {
		const { container } = render(<CanvasSkeleton />);

		const box = container.querySelector('.rounded-2xl');
		expect(box).toBeInTheDocument();
		expect(box).toHaveClass('border', 'shadow-lg', 'overflow-hidden');
	});

	it('renders pulsing gradient background', () => {
		const { container } = render(<CanvasSkeleton />);

		const gradient = container.querySelector('.animate-pulse');
		expect(gradient).toBeInTheDocument();
		expect(gradient).toHaveClass('bg-gradient-to-br', 'from-gray-200');
	});
});
