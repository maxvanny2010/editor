import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { EditorState } from '@/entities/editor/model/types.ts';

const initialState: EditorState = {
	viewport: {
		scale: 1,
		offsetX: 0,
		offsetY: 0,
	},
	activeTool: null,
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
			state.activeTool = action.payload;
		},
	},
});

export const { setScale, setOffset, resetViewport, setActiveTool } = editorSlice.actions;

export const editorReducer = editorSlice.reducer;
