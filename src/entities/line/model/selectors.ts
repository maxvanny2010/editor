import type { RootState } from '@/store';

export const selectLineState = (state: RootState) => state.line;

export const selectLineActive = (state: RootState) => state.line.active;

export const selectLineColor = (state: RootState) => state.line.color;

export const selectLineThickness = (state: RootState) => state.line.thickness;

export const selectLinePaletteModel = (state: RootState) => ({
	active: state.line.active,
	color: state.line.color,
	thickness: state.line.thickness,
});
