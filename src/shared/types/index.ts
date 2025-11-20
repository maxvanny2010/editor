export type EditorTool = 'brush' | 'line' | 'shape' | 'eraser' | null;
export type ShapeType = 'rect' | 'circle';
// ─── Project / Layer / ViewState ───────────────────────────────
export interface Project {
	id: string;
	name: string;
	width: number;
	height: number;
	createdAt: number;
	updatedAt: number;
	snapshot?: string;
}
export interface Layer {
	id: string;
	projectId: string;
	name: string;
	visible: boolean;
	opacity: number; // 0..1
	zIndex: number;
	createdAt: number;
	updatedAt: number;
	snapshot?: string;
}

export interface ProjectViewState {
	projectId: string;
	scale: number;
	offsetX: number;
	offsetY: number;
	showGrid: boolean;
	snapshot?: string; // base64 PNG preview
}

// ─── History / Editor Snapshot ───────────────────────────────
export interface SerializedLayer {
	id: string;
	name: string;
	visible: boolean;
	opacity: number;
	zIndex: number;
	snapshot?: string;
}

export interface EditorSnapshot {
	projectId: string;
	layers: SerializedLayer[];
	activeTool: EditorTool;
	viewport: {
		scale: number;
		offsetX: number;
		offsetY: number;
	};
}

export interface HistoryEntry {
	id: string;
	label: string;
	state: EditorSnapshot;
	timestamp: number;
	toolType?: Exclude<EditorTool, null>;
	shapeType?: ShapeType;
	icon?: string;
}

export interface HistoryState {
	stack: HistoryEntry[];
	currentIndex: number;
	isPreview: boolean;
}

export interface ViewportState {
	scale: number;
	offsetX: number;
	offsetY: number;
}

export interface EditorState {
	viewport: ViewportState;
	activeTool: EditorTool;
	paletteOpen: boolean;
}

export interface ActiveProject {
	id: 'active';
	projectId: string;
}
export interface CanvasPoint {
	x: number;
	y: number;
}
