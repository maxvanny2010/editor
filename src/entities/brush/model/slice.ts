import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type BrushState = {
	color: string;
	size: number;
	isDrawing: boolean;
};

const initialState: BrushState = {
	color: '#1F2937',
	size: 4,
	isDrawing: false,
};

const brushSlice = createSlice({
	name: 'brush',
	initialState,
	reducers: {
		setBrushColor(state, action: PayloadAction<string>) {
			state.color = action.payload;
		},
		setBrushSize(state, action: PayloadAction<number>) {
			state.size = action.payload;
		},
		setBrushDrawing(state, action: PayloadAction<boolean>) {
			state.isDrawing = action.payload;
		},
	},
});

export const { setBrushColor, setBrushSize, setBrushDrawing } = brushSlice.actions;
export const brushReducer = brushSlice.reducer;
