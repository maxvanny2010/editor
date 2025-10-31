export interface Project {
	id: string;
	name: string;
	width: number;
	height: number;
	createdAt: number;
	updatedAt: number;
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
