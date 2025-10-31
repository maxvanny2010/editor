import { fireEvent, render } from '@testing-library/react';
import { DrawCanvas } from '@/widgets/canvas/ui/DrawCanvas';

describe('DrawCanvas', () => {
	it('renders correctly with width and height', () => {
		const { getByTestId } = render(
			<DrawCanvas width={500} height={300} isPanning={false} />,
		);
		const canvas = getByTestId('draw-canvas') as HTMLCanvasElement;

		expect(canvas).toBeInTheDocument();
		expect(canvas.getAttribute('width')).toBe('500');
		expect(canvas.getAttribute('height')).toBe('300');
	});

	it('fires pointer event handlers when provided', () => {
		const onDown = vi.fn();
		const onMove = vi.fn();
		const onUp = vi.fn();

		const { getByRole } = render(
			<DrawCanvas
				width={400}
				height={200}
				onPointerDown={onDown}
				onPointerMove={onMove}
				onPointerUp={onUp}
				isPanning={false}
			/>,
		);

		const canvas = getByRole('presentation') as HTMLCanvasElement;
		fireEvent.pointerDown(canvas);
		fireEvent.pointerMove(canvas);
		fireEvent.pointerUp(canvas);

		expect(onDown).toHaveBeenCalled();
		expect(onMove).toHaveBeenCalled();
		expect(onUp).toHaveBeenCalled();
	});

	it('renders safely without handlers', () => {
		const { getByTestId } = render(
			<DrawCanvas width={100} height={100} isPanning={false} />,
		);
		const canvas = getByTestId('draw-canvas') as HTMLCanvasElement;

		expect(canvas).toBeInTheDocument();
		fireEvent.pointerDown(canvas);
		fireEvent.pointerUp(canvas);
	});
});
