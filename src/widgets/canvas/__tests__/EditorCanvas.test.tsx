import { act, render, screen } from '@testing-library/react';
import { EditorCanvas } from '@/widgets/canvas/model';

// Define a helper type that matches our mock class from vitest.setup.ts
interface MockResizeObserverConstructor {
	instances: ResizeObserver[];

	new (
		cb: (entries: Array<{ contentRect: Partial<DOMRectReadOnly> }>) => void,
	): ResizeObserver;

	trigger(rect: Partial<DOMRectReadOnly>): void;
}

// Cast global.ResizeObserver once (strongly typed)
const MockedResizeObserver =
	globalThis.ResizeObserver as unknown as MockResizeObserverConstructor;

describe('EditorCanvas', () => {
	it('renders and applies CSS dimensions correctly', () => {
		const { container } = render(
			<div style={{ width: '1000px', height: '800px' }}>
				<EditorCanvas width={1000} height={600} />
			</div>,
		);

		const canvas = screen.getByTestId('editor-canvas') as HTMLCanvasElement;
		expect(canvas).toBeInTheDocument();

		// Ensure CSS width and height match logical size
		expect(canvas.style.width).toBe('1000px');
		expect(canvas.style.height).toBe('600px');
		expect(container).toMatchSnapshot();
	});

	it('reacts to ResizeObserver updates by applying transform styles', () => {
		render(
			<div style={{ width: '1200px', height: '900px' }}>
				<EditorCanvas width={1000} height={500} />
			</div>,
		);

		const holder = screen.getByLabelText('canvas-scale-holder');

		// Trigger a resize event via the typed mock
		act(() => {
			MockedResizeObserver.trigger({ width: 1200, height: 900 });
		});

		const style = (holder as HTMLElement).getAttribute('style') ?? '';
		expect(style.includes('transform')).toBe(true);
	});
});
