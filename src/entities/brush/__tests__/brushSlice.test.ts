import {
	brushReducer,
	setBrushColor,
	setBrushDrawing,
	setBrushSize,
} from '@/entities/brush/model/slice';

describe('brushSlice', () => {
	it('updates color correctly', () => {
		const initial = { color: '#000000', size: 4, isDrawing: false };
		const next = brushReducer(initial, setBrushColor('#FF0000'));
		expect(next.color).toBe('#FF0000');
	});

	it('updates size correctly', () => {
		const initial = { color: '#000000', size: 4, isDrawing: false };
		const next = brushReducer(initial, setBrushSize(8));
		expect(next.size).toBe(8);
	});

	it('toggles drawing state correctly', () => {
		const initial = { color: '#000000', size: 4, isDrawing: false };
		const next = brushReducer(initial, setBrushDrawing(true));
		expect(next.isDrawing).toBe(true);
	});
});
