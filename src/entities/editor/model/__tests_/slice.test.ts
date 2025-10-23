import { editorReducer, resetViewport, setOffset, setScale } from '../slice';

describe('editorSlice', () => {
	it('updates scale', () => {
		const next = editorReducer(undefined, setScale(2));
		expect(next.viewport.scale).toBe(2);
	});

	it('clamps scale', () => {
		const tooSmall = editorReducer(undefined, setScale(0));
		expect(tooSmall.viewport.scale).toBe(0.1);
	});

	it('sets offset', () => {
		const next = editorReducer(undefined, setOffset({ x: 100, y: -50 }));
		expect(next.viewport.offsetX).toBe(100);
		expect(next.viewport.offsetY).toBe(-50);
	});

	it('resets viewport', () => {
		let state = editorReducer(undefined, setOffset({ x: 10, y: 10 }));
		state = editorReducer(state, resetViewport());
		expect(state.viewport.offsetX).toBe(0);
	});
});
