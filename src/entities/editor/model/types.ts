export interface ViewportState {
	scale: number;
	offsetX: number;
	offsetY: number;
}

export interface EditorState {
	viewport: ViewportState;
	activeTool: 'brush' | 'eraser' | 'line' | 'rect' | 'circle' | null;
	paletteOpen: boolean;
}
