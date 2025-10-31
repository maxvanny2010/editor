import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ShapeType = 'rect' | 'circle';

export interface ShapeState {
	active: boolean;
	type: ShapeType;
	fill: string;
	stroke: string;
	thickness: number;
}

const initialState: ShapeState = {
	active: false,
	type: 'rect',
	fill: '#ffffff',
	stroke: '#000000',
	thickness: 2,
};

const shapeSlice = createSlice({
	name: 'shape',
	initialState,
	reducers: {
		setShapeType(state, action: PayloadAction<ShapeType>) {
			state.type = action.payload;
		},
		setShapeFill(state, action: PayloadAction<string>) {
			state.fill = action.payload;
		},
		setShapeStroke(state, action: PayloadAction<string>) {
			state.stroke = action.payload;
		},
		setShapeThickness(state, action: PayloadAction<number>) {
			state.thickness = action.payload;
		},
		resetShapeState: () => initialState,
	},
});

export const {
	setShapeType,
	setShapeFill,
	setShapeStroke,
	setShapeThickness,
	resetShapeState,
} = shapeSlice.actions;

export const shapeReducer = shapeSlice.reducer;
