import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { EditorState } from '@/shared/types';

const initialState: EditorState = {
	viewport: {
		scale: 1,
		offsetX: 0,
		offsetY: 0,
	},
	activeTool: null,
	paletteOpen: false,
};

const editorSlice = createSlice({
	name: 'editor',
	initialState,
	reducers: {
		setScale(state, action: PayloadAction<number>) {
			state.viewport.scale = Math.max(0.1, Math.min(10, action.payload));
		},
		setOffset(state, action: PayloadAction<{ x: number; y: number }>) {
			state.viewport.offsetX = action.payload.x;
			state.viewport.offsetY = action.payload.y;
		},
		resetViewport(state) {
			state.viewport = initialState.viewport;
		},

		setActiveTool(state, action: PayloadAction<EditorState['activeTool']>) {
			if (state.activeTool === action.payload) {
				state.paletteOpen = !state.paletteOpen;
			} else {
				state.activeTool = action.payload;
				state.paletteOpen = true;
			}
		},

		resetEditorState: () => initialState,
	},
});

export const { setScale, setOffset, resetViewport, setActiveTool, resetEditorState } =
	editorSlice.actions;

export const editorReducer = editorSlice.reducer;
