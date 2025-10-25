import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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
	name: 'line',
	initialState,
	reducers: {
		activateLine(state) {
			state.active = true;
		},
		deactivateLine(state) {
			state.active = false;
		},
		setLineColor(state, action: PayloadAction<string>) {
			state.color = action.payload;
		},
		setLineThickness(state, action: PayloadAction<number>) {
			state.thickness = action.payload;
		},
	},
});

export const { activateLine, deactivateLine, setLineColor, setLineThickness } =
	lineSlice.actions;

export const lineReducer = lineSlice.reducer;
