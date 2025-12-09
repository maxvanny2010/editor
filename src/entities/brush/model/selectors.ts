import type { RootState } from '@/store';

export const selectBrushState = (state: RootState) => state.brush;

export const selectBrushColor = (state: RootState) => state.brush.color;

export const selectBrushSize = (state: RootState) => state.brush.size;

export const selectBrushPaletteModel = (state: RootState) => ({
	color: state.brush.color,
	size: state.brush.size,
});
