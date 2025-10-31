import { act, fireEvent, render } from '@testing-library/react';
import * as appHooks from '@/store/hooks';
import { TestStoreProvider } from '@/test-utils';
import { EditorViewport } from '@/widgets/viewport/model';
import { resetViewport, setOffset, setScale } from '@/entities/editor/model/slice';

vi.mock('@/entities/editor/model/slice', async (orig) => {
	const actual = (await orig()) as Record<string, unknown>;
	return {
		...actual,
		setScale: vi.fn((v: number) => ({ type: 'editor/setScale', payload: v })),
		setOffset: vi.fn((p: { x: number; y: number }) => ({
			type: 'editor/setOffset',
			payload: p,
		})),
		resetViewport: vi.fn(() => ({ type: 'editor/resetViewport' })),
	};
});

function setup() {
	const utils = render(
		<TestStoreProvider>
			<EditorViewport
				projectId="p1"
				width={800}
				height={600}
				isLayersOpen={false}
			/>
		</TestStoreProvider>,
	);
	return {
		...utils,
		container: utils.getByTestId('viewport-container'),
	};
}

describe('EditorViewport — user interactions', () => {
	let dispatchMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		dispatchMock = vi.fn();
		vi.spyOn(appHooks, 'useAppDispatch').mockReturnValue(dispatchMock);
		vi.spyOn(appHooks, 'useAppSelector').mockImplementation((selector) => {
			// return fake viewport state
			if (selector.name === 'selectViewport') {
				return { scale: 1, offsetX: 0, offsetY: 0 };
			}
			// return fake layers
			return [];
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('Ctrl+wheel → dispatch(setScale)', () => {
		const { container } = setup();

		const wheel = new WheelEvent('wheel', {
			deltaY: 100,
			ctrlKey: true,
			bubbles: true,
			cancelable: true,
		});

		const prevent = vi.fn();
		Object.defineProperty(wheel, 'preventDefault', { value: prevent });
		container.dispatchEvent(wheel);

		expect(prevent).toHaveBeenCalled();
		expect(setScale).toHaveBeenCalledWith(expect.any(Number));
		expect(dispatchMock).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'editor/setScale' }),
		);
	});

	it('Middle mouse drag → dispatch(setOffset)', () => {
		const { container } = setup();

		fireEvent.mouseDown(container, { button: 1, clientX: 100, clientY: 100 });
		fireEvent.mouseMove(container, { clientX: 130, clientY: 120 }); // dx=30, dy=20
		fireEvent.mouseUp(container);

		expect(setOffset).toHaveBeenCalledWith(expect.objectContaining({ x: 30, y: 20 }));
		expect(dispatchMock).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'editor/setOffset' }),
		);
	});

	it('Fit button → dispatch(setScale)', () => {
		const { getByTestId } = setup();

		fireEvent.click(getByTestId('fit-button-testid'));
		expect(setScale).toHaveBeenCalledWith(expect.any(Number));
		expect(dispatchMock).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'editor/setScale' }),
		);
	});

	it('Reset button → triggers animation and dispatches resetViewport', () => {
		vi.useFakeTimers();

		const raf = vi
			.spyOn(window, 'requestAnimationFrame')
			.mockImplementation((cb: FrameRequestCallback) => {
				cb(performance.now() + 400);
				return 1;
			});

		const { getByTestId } = setup();
		fireEvent.click(getByTestId('reset-button-testid'));

		act(() => {
			vi.advanceTimersByTime(400);
		});

		expect(resetViewport).toHaveBeenCalled();
		expect(dispatchMock).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'editor/resetViewport' }),
		);

		raf.mockRestore();
		vi.useRealTimers();
	});

	it('Grid toggle button → toggles between Hide and Show text', () => {
		const { getByTestId } = setup();

		const gridButton = getByTestId('grid-button-testid');
		expect(gridButton).toHaveTextContent(/Hide Grid/i);

		fireEvent.click(gridButton);
		expect(gridButton).toHaveTextContent(/Show Grid/i);

		fireEvent.click(gridButton);
		expect(gridButton).toHaveTextContent(/Hide Grid/i);
	});
});
