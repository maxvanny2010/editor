import { act, fireEvent, render } from '@testing-library/react';
import * as appHooks from '@/store/hooks';
import { EditorViewport } from '@/widgets/viewport/ui/EditorViewport';
import { TestStoreProvider } from '@/test-utils/testStoreProvider';
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

describe('EditorViewport — user interactions', () => {
	let dispatchMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		dispatchMock = vi.fn();
		vi.spyOn(appHooks, 'useAppDispatch').mockReturnValue(dispatchMock);
		vi.spyOn(appHooks, 'useAppSelector').mockReturnValue({
			scale: 1,
			offsetX: 0,
			offsetY: 0,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('Ctrl+wheel → dispatch(setScale)', () => {
		const { getByTestId } = render(
			<TestStoreProvider>
				<EditorViewport />
			</TestStoreProvider>,
		);

		const container = getByTestId('viewport-container');
		const wheelEvent = new WheelEvent('wheel', {
			deltaY: 100,
			ctrlKey: true,
			bubbles: true,
			cancelable: true,
		});

		const prevent = vi.spyOn(wheelEvent, 'preventDefault');
		container.dispatchEvent(wheelEvent);

		expect(prevent).toHaveBeenCalled();
		expect(setScale).toHaveBeenCalledWith(expect.any(Number));
		expect(dispatchMock).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'editor/setScale' }),
		);
	});

	it('Middle mouse drag → dispatch(setOffset)', () => {
		const { getByTestId } = render(
			<TestStoreProvider>
				<EditorViewport />
			</TestStoreProvider>,
		);

		const container = getByTestId('viewport-container');
		fireEvent.mouseDown(container, { button: 1, clientX: 100, clientY: 100 });
		fireEvent.mouseMove(container, { clientX: 130, clientY: 120 }); // dx=30, dy=20
		fireEvent.mouseUp(container);

		expect(setOffset).toHaveBeenCalledWith(expect.objectContaining({ x: 30, y: 20 }));
		expect(dispatchMock).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'editor/setOffset' }),
		);
	});

	it('Fit button → dispatch(setScale)', () => {
		const { getByTestId } = render(
			<TestStoreProvider>
				<EditorViewport />
			</TestStoreProvider>,
		);

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

		const { getByTestId } = render(
			<TestStoreProvider>
				<EditorViewport />
			</TestStoreProvider>,
		);

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

	it('Grid toggle button → toggles text between Hide and Show', () => {
		const { getByTestId, getByText } = render(
			<TestStoreProvider>
				<EditorViewport />
			</TestStoreProvider>,
		);

		const hideButton = getByText(/Hide Grid/i);
		expect(hideButton).toBeInTheDocument();

		fireEvent.click(getByTestId('grid-button-testid'));
		expect(getByText(/Show Grid/i)).toBeInTheDocument();

		fireEvent.click(getByTestId('grid-button-testid'));
		expect(getByText(/Hide Grid/i)).toBeInTheDocument();
	});
});
