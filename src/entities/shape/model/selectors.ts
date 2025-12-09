import type { RootState } from '@/store';

export const selectShapeState = (state: RootState) => state.shape;

export const selectShapeActive = (state: RootState) => state.shape.active;

export const selectShapeType = (state: RootState) => state.shape.type;

export const selectShapeFill = (state: RootState) => state.shape.fill;

export const selectShapeStroke = (state: RootState) => state.shape.stroke;

export const selectShapeThickness = (state: RootState) => state.shape.thickness;

export const selectShapePaletteModel = (state: RootState) => ({
	type: state.shape.type,
	fill: state.shape.fill,
	stroke: state.shape.stroke,
	thickness: state.shape.thickness,
});
