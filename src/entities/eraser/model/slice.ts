import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface EraserState {
	active: boolean;
	size: number;
}

const initialState: EraserState = {
	active: false,
	size: 8,
};

const eraserSlice = createSlice({
	name: 'eraser',
	initialState,
	reducers: {
		setEraserSize(state, action: PayloadAction<number>) {
			state.size = action.payload;
		},
	},
});

export const { setEraserSize } = eraserSlice.actions;
export const eraserReducer = eraserSlice.reducer;
