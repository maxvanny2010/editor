import { render } from '@testing-library/react';
import { EditorSkeleton } from '@/widgets/widgets/editor/ui';

describe('EditorSkeleton', () => {
	it('renders full editor skeleton layout', () => {
		const { container } = render(<EditorSkeleton />);

		const editor = container.querySelector('.h-screen.w-screen');
		expect(editor).toBeInTheDocument();
		expect(editor).toHaveClass('bg-gray-100', 'dark:bg-gray-900');
	});

	it('renders all child skeleton components', () => {
		const { container } = render(<EditorSkeleton />);

		// Check for LeftToolbar
		expect(container.querySelector('.absolute.top-1\\/2.left-4')).toBeInTheDocument();

		// Check for Canvas
		expect(container.querySelector('.flex-1')).toBeInTheDocument();

		// Check for RightSidebar
		expect(container.querySelector('.absolute.right-0.top-0')).toBeInTheDocument();

		// Check for BottomFooter
		expect(container.querySelector('.absolute.bottom-0.left-0')).toBeInTheDocument();
	});
});
