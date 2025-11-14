import { render, screen } from '@testing-library/react';
import { ToolIcon } from '@/entities/history/ui';
import type { EditorTool } from '@/shared/types';
import type { SystemIconName } from '@/shared/constants';

const getSvg = () => screen.getByTestId('tool-icon').querySelector('svg') as SVGElement;

describe('ToolIcon (updated colors)', () => {
	// ────────────────────────────────────────────
	// System icons
	// ────────────────────────────────────────────
	const systemIconCases: Record<SystemIconName, { text: string; bg: string }> = {
		'plus-square': { text: 'text-emerald-600', bg: 'bg-emerald-100' },
		trash: { text: 'text-rose-600', bg: 'bg-rose-100' },
		edit: { text: 'text-blue-600', bg: 'bg-blue-100' },
		shuffle: { text: 'text-indigo-600', bg: 'bg-indigo-100' },
		sliders: { text: 'text-amber-600', bg: 'bg-amber-100' },
	};

	for (const [iconName, colors] of Object.entries(systemIconCases)) {
		it(`renders ${iconName} with correct colors`, () => {
			render(<ToolIcon type={null} iconName={iconName as SystemIconName} />);
			const svg = getSvg();
			expect(svg).toHaveClass(colors.text);
			expect(svg).toHaveClass(colors.bg);
		});
	}

	// ────────────────────────────────────────────
	// Drawing tools
	// ────────────────────────────────────────────
	it('renders brush icon', () => {
		render(<ToolIcon type="brush" />);
		const svg = getSvg();
		expect(svg).toHaveClass('text-indigo-500', 'bg-indigo-100');
	});

	it('renders eraser icon', () => {
		render(<ToolIcon type="eraser" />);
		const svg = getSvg();
		expect(svg).toHaveClass('text-rose-500', 'bg-rose-100');
	});

	it('renders line icon', () => {
		render(<ToolIcon type="line" />);
		const svg = getSvg();
		expect(svg).toHaveClass('text-emerald-500', 'bg-emerald-100');
	});

	// ────────────────────────────────────────────
	// Shapes
	// ────────────────────────────────────────────
	it('renders circle shape', () => {
		render(<ToolIcon type="shape" shapeType="circle" />);
		const svg = getSvg();
		expect(svg).toHaveClass('text-violet-500', 'bg-violet-100');
	});

	it('renders rect shape', () => {
		render(<ToolIcon type="shape" shapeType="rect" />);
		const svg = getSvg();
		expect(svg).toHaveClass('text-violet-500', 'bg-violet-100');
	});

	it('defaults to rect when no shapeType provided', () => {
		render(<ToolIcon type="shape" />);
		const svg = getSvg();
		expect(svg).toHaveClass('text-violet-500', 'bg-violet-100');
	});

	// ────────────────────────────────────────────
	// Default
	// ────────────────────────────────────────────
	it('falls back to edit color for null type', () => {
		render(<ToolIcon type={null} />);
		const svg = getSvg();
		expect(svg).toHaveClass('text-blue-600', 'bg-blue-100');
	});

	it('fallback for unknown type', () => {
		render(<ToolIcon type={'xxx' as EditorTool} />);
		const svg = getSvg();
		expect(svg).toHaveClass('text-blue-600', 'bg-blue-100');
	});

	// ────────────────────────────────────────────
	// Custom size
	// ────────────────────────────────────────────
	it('applies custom className', () => {
		render(<ToolIcon type="brush" className="w-8 h-8 custom-class" />);
		const svg = getSvg();
		expect(svg).toHaveClass('w-8', 'h-8', 'custom-class');
	});

	it('uses default size when not provided', () => {
		render(<ToolIcon type="brush" />);
		expect(getSvg()).toHaveClass('w-4', 'h-4');
	});

	// ────────────────────────────────────────────
	// Priority
	// ────────────────────────────────────────────
	it('prioritizes system icon over tool type', () => {
		render(<ToolIcon type="brush" iconName="trash" />);
		const svg = getSvg();
		expect(svg).toHaveClass('text-rose-600', 'bg-rose-100');
	});

	it('prioritizes system icon over shape', () => {
		render(<ToolIcon type="shape" shapeType="circle" iconName="plus-square" />);
		const svg = getSvg();
		expect(svg).toHaveClass('text-emerald-600', 'bg-emerald-100');
	});

	// ────────────────────────────────────────────
	// Integration
	// ────────────────────────────────────────────
	it('integration: applies iconName + custom size', () => {
		render(
			<ToolIcon
				type="shape"
				shapeType="circle"
				iconName="edit"
				className="w-6 h-6"
			/>,
		);
		const svg = getSvg();
		expect(svg).toHaveClass('w-6', 'h-6', 'text-blue-600', 'bg-blue-100');
	});

	it('integration: works without optional params', () => {
		render(<ToolIcon type="line" />);
		const svg = getSvg();
		expect(svg).toHaveClass('text-emerald-500', 'bg-emerald-100');
	});
});
