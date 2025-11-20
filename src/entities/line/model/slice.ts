import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TOOLS } from '@/shared/constants';

export interface LineState {
	active: boolean;
	color: string;
	thickness: number;
}

const initialState: LineState = {
	active: false,
	color: '#000000',
	thickness: 2,
};

const lineSlice = createSlice({
	name: TOOLS.LINE,
	initialState,
	reducers: {
		setLineColor(state, action: PayloadAction<string>) {
			state.color = action.payload;
		},
		setLineThickness(state, action: PayloadAction<number>) {
			state.thickness = action.payload;
		},
		resetLineState: () => initialState,
	},
});

export const { setLineColor, setLineThickness, resetLineState } = lineSlice.actions;

export const lineReducer = lineSlice.reducer;
