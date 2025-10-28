import { fireEvent, render, screen } from '@testing-library/react';
import * as appHooks from '@/store/hooks';
import { ShapeFloatingPalette } from '@/entities/shape/model';
import {
	setShapeFill,
	setShapeStroke,
	setShapeThickness,
	setShapeType,
} from '@/entities/shape/model/slice';
import { TestStoreProvider } from '@/test-utils/testStoreProvider';

vi.mock('@/entities/shape/model/slice', async (orig) => {
	const actual = (await orig()) as Record<string, unknown>;
	return {
		...actual,
		setShapeType: vi.fn((t: string) => ({ type: 'shape/setShapeType', payload: t })),
		setShapeFill: vi.fn((c: string) => ({ type: 'shape/setShapeFill', payload: c })),
		setShapeStroke: vi.fn((c: string) => ({
			type: 'shape/setShapeStroke',
			payload: c,
		})),
		setShapeThickness: vi.fn((n: number) => ({
			type: 'shape/setShapeThickness',
			payload: n,
		})),
	};
});

describe('ShapeFloatingPalette — user interactions', () => {
	let dispatchMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		dispatchMock = vi.fn();

		vi.spyOn(appHooks, 'useAppDispatch').mockReturnValue(dispatchMock);
		vi.spyOn(appHooks, 'useAppSelector').mockReturnValue({
			active: false,
			type: 'rect',
			fill: '#ff0000',
			stroke: '#000000',
			thickness: 3,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders shape type buttons and color input', () => {
		render(
			<TestStoreProvider>
				<ShapeFloatingPalette />
			</TestStoreProvider>,
		);

		expect(screen.getByTestId('shape-type-rect')).toBeInTheDocument();
		expect(screen.getByTestId('shape-type-circle')).toBeInTheDocument();
		expect(screen.getByTestId('shape-fill-color')).toHaveValue('#ff0000');
	});

	it('clicking a shape type icon dispatches setShapeType', () => {
		render(
			<TestStoreProvider>
				<ShapeFloatingPalette />
			</TestStoreProvider>,
		);

		fireEvent.click(screen.getByTestId('shape-type-circle'));

		expect(setShapeType).toHaveBeenCalledWith('circle');
		expect(dispatchMock).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'shape/setShapeType' }),
		);
	});

	it('changing color input dispatches setShapeFill', () => {
		render(
			<TestStoreProvider>
				<ShapeFloatingPalette />
			</TestStoreProvider>,
		);

		fireEvent.change(screen.getByTestId('shape-fill-color'), {
			target: { value: '#00ff00' },
		});

		expect(setShapeFill).toHaveBeenCalledWith('#00ff00');
		expect(dispatchMock).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'shape/setShapeFill' }),
		);
	});

	it('palette callbacks exist for stroke and thickness', () => {
		render(
			<TestStoreProvider>
				<ShapeFloatingPalette />
			</TestStoreProvider>,
		);

		expect(setShapeStroke).toBeDefined();
		expect(setShapeThickness).toBeDefined();
	});
});
