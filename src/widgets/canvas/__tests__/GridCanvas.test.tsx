import { render } from '@testing-library/react';
import { GridCanvas } from '@/widgets/canvas/ui/GridCanvas';

// Helper: safely create a partial mock of CanvasRenderingContext2D
function createMockContext2D(): CanvasRenderingContext2D {
	return {
		clearRect: vi.fn(),
		fillRect: vi.fn(),
		beginPath: vi.fn(),
		moveTo: vi.fn(),
		lineTo: vi.fn(),
		stroke: vi.fn(),
		fillText: vi.fn(),
		save: vi.fn(),
		restore: vi.fn(),
		canvas: document.createElement('canvas'),
		font: '',
		fillStyle: '',
		strokeStyle: '',
		lineWidth: 1,
	} as unknown as CanvasRenderingContext2D;
}

// Helper: override getContext safely
function mockCanvasContext(ctx: CanvasRenderingContext2D) {
	Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
		value: vi.fn(() => ctx),
		writable: true,
	});
}

describe('GridCanvas', () => {
	it('renders canvas with correct dimensions', () => {
		const { container } = render(
			<GridCanvas width={800} height={600} showGrid={true} background={'#fff'} />,
		);

		const canvas = container.querySelector('canvas');
		expect(canvas).toBeInTheDocument();
		expect(canvas?.getAttribute('width')).toBe('800');
		expect(canvas?.getAttribute('height')).toBe('600');
	});

	it('draws background and grid when showGrid = true', () => {
		const ctxMock = createMockContext2D();
		mockCanvasContext(ctxMock);

		render(
			<GridCanvas width={400} height={400} showGrid={true} background={'#fff'} />,
		);

		expect(ctxMock.clearRect).toHaveBeenCalled();
		expect(ctxMock.fillRect).toHaveBeenCalled(); // background fill
		expect(ctxMock.beginPath).toHaveBeenCalled(); // grid drawing
	});

	it('skips grid drawing when showGrid = false', () => {
		const ctxMock = createMockContext2D();
		mockCanvasContext(ctxMock);

		render(
			<GridCanvas width={200} height={200} showGrid={false} background={'#fff'} />,
		);

		expect(ctxMock.fillRect).toHaveBeenCalled(); // background drawn
		expect(ctxMock.beginPath).not.toHaveBeenCalled(); // no grid lines
	});
});
