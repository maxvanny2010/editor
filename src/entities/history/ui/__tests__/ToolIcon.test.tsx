import { render, screen } from '@testing-library/react';
import { ToolIcon } from '@/entities/history/ui';
import type { EditorTool } from '@/shared/types';
import type { SystemIconName } from '@/shared/constants';

describe('ToolIcon', () => {
	// Универсальный селектор
	const getSvg = () =>
		screen.getByTestId('tool-icon').querySelector('svg') as SVGElement;

	describe('System icons', () => {
		const systemIcons: SystemIconName[] = [
			'plus-square',
			'trash',
			'edit',
			'shuffle',
			'sliders',
		];

		systemIcons.forEach((iconName) => {
			it(`renders ${iconName} icon with default system color`, () => {
				render(<ToolIcon type={null} iconName={iconName} />);

				const svg = getSvg();

				expect(svg).toBeInTheDocument();
				expect(svg).toHaveClass('text-gray-600');
			});
		});
	});

	describe('Drawing tool icons', () => {
		it('renders brush icon', () => {
			render(<ToolIcon type="brush" />);

			const svg = getSvg();
			expect(svg).toHaveClass('text-blue-600');
		});

		it('renders eraser icon', () => {
			render(<ToolIcon type="eraser" />);

			const svg = getSvg();
			expect(svg).toHaveClass('text-red-600');
		});

		it('renders line icon', () => {
			render(<ToolIcon type="line" />);

			const svg = getSvg();
			expect(svg).toHaveClass('text-green-600');
		});
	});

	describe('Shape icons', () => {
		it('renders circle icon', () => {
			render(<ToolIcon type="shape" shapeType="circle" />);

			const svg = getSvg();
			expect(svg).toHaveClass('text-purple-600');
		});

		it('renders square icon (rect)', () => {
			render(<ToolIcon type="shape" shapeType="rect" />);

			const svg = getSvg();
			expect(svg).toHaveClass('text-purple-600');
		});

		it('renders square icon by default', () => {
			render(<ToolIcon type="shape" />);

			const svg = getSvg();
			expect(svg).toHaveClass('text-purple-600');
		});
	});

	describe('Default icons', () => {
		it('renders default icon for null type', () => {
			render(<ToolIcon type={null} />);

			const svg = getSvg();
			expect(svg).toHaveClass('text-gray-600', 'bg-gray-100');
		});

		it('renders default icon for unknown type', () => {
			render(<ToolIcon type={'unknown' as EditorTool} />);

			const svg = getSvg();
			expect(svg).toHaveClass('text-gray-600', 'bg-gray-100');
		});
	});

	describe('Custom className', () => {
		it('applies custom className', () => {
			render(<ToolIcon type="brush" className="w-8 h-8 custom-class" />);

			const svg = getSvg();
			expect(svg).toHaveClass('w-8', 'h-8', 'custom-class');
		});

		it('uses default className when not provided', () => {
			render(<ToolIcon type="brush" />);

			const svg = getSvg();
			expect(svg).toHaveClass('w-4', 'h-4');
		});
	});

	describe('Priority', () => {
		it('prioritizes system icon over tool type', () => {
			render(<ToolIcon type="brush" iconName="trash" />);

			const svg = getSvg();
			expect(svg).toHaveClass('text-gray-600');
		});

		it('prioritizes system icon over shape', () => {
			render(<ToolIcon type="shape" shapeType="circle" iconName="plus-square" />);

			const svg = getSvg();
			expect(svg).toHaveClass('text-gray-600');
		});
	});

	describe('Integration', () => {
		it('handles all parameters together', () => {
			render(
				<ToolIcon
					type="shape"
					shapeType="circle"
					iconName="edit"
					className="w-6 h-6"
				/>,
			);

			const svg = getSvg();
			expect(svg).toHaveClass('w-6', 'h-6', 'text-gray-600');
		});

		it('renders correctly without optional params', () => {
			render(<ToolIcon type="line" />);

			const svg = getSvg();
			expect(svg).toHaveClass('text-green-600');
		});
	});
});
