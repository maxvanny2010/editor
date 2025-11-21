import {
	brushReducer,
	resetBrushState,
	setBrushColor,
	setBrushSize,
} from '@/entities/brush/model/slice';

describe('brushSlice', () => {
	it('updates color correctly', () => {
		const initial = { color: '#000000', size: 4 };
		const next = brushReducer(initial, setBrushColor('#FF0000'));
		expect(next.color).toBe('#FF0000');
	});

	it('updates size correctly', () => {
		const initial = { color: '#000000', size: 4 };
		const next = brushReducer(initial, setBrushSize(8));
		expect(next.size).toBe(8);
	});

	it('resets brush state correctly', () => {
		const initial = { color: '#FF0000', size: 10 };
		const next = brushReducer(initial, resetBrushState());
		expect(next).toEqual({ color: '#1F2937', size: 4 });
	});
});
