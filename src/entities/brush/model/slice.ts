import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TOOLS } from '@/shared/constants';

export type BrushState = {
	color: string;
	size: number;
};

const initialState: BrushState = {
	color: '#1F2937',
	size: 4,
};

const brushSlice = createSlice({
	name: TOOLS.BRUSH,
	initialState,
	reducers: {
		setBrushColor(state, action: PayloadAction<string>) {
			state.color = action.payload;
		},
		setBrushSize(state, action: PayloadAction<number>) {
			state.size = action.payload;
		},
		resetBrushState: () => initialState,
	},
});

export const { setBrushColor, setBrushSize, resetBrushState } = brushSlice.actions;
export const brushReducer = brushSlice.reducer;
