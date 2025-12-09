export const NAMES = {
	PROJECTS: 'projects',
	HISTORY: 'history',
	LAYERS: 'layers',
	EDITOR: 'editor',
	ACTIVE_PROJECT: 'activeProject',
} as const;

import type { EditorTool, ShapeType } from '@/shared/types';

export const TOOLS = {
	BRUSH: 'brush',
	LINE: 'line',
	SHAPE: 'shape',
	ERASER: 'eraser',
} as const;

export const SHAPES = {
	RECT: 'rect',
	CIRCLE: 'circle',
} as const;

export const REPOSITORY_FIELDS = {
	PROJECT_ID: 'projectId',
	ID: 'id',
	STATE_PROJECT_ID: 'state.projectId',
	TIMESTAMP: 'timestamp',
	Z_INDEX: 'zIndex',
	NAME: 'name',
	UPDATED_AT: 'updatedAt',
} as const;

export const UI_LABELS = {
	SHOW_GRID: 'Show Grid',
	HIDE_GRID: 'Hide Grid',
	DRAW_RECTANGLE: 'Draw rectangle',
	SNAPSHOT: 'Snapshot',
	APPLY_SNAPSHOT: 'Applied snapshot',
	NAME: (i: number) => `Action ${i}`,
	LAYERS: 'Layers',
	HISTORY: 'History',
	SHAPE_TOOL: 'Shape',
	LINE_TOOL: 'Line',
	LINE_TOOL_SUB: 'Thickness & Color',
	ERASER_TOOL: 'Eraser',
	ERASER_TOOL_SIZE: 'Size',
	BRUSH_TOOL: 'Brush',
	BRUSH_TOOL_SUB: 'Size & Color',
	MODAL_CREATE: 'Create new project',
	MODAL_CREATE_BUTTON: 'Create',
	MODAL_DELETE_BUTTON: 'Delete',
	MODAL_DELETE: 'Delete project',
	MODAL_UPDATE: 'Update project name',
	MODAL_UPDATE_BUTTON: 'Update',
	LAYER_SHOW: 'Show layer',
	LAYER_HIDE: 'Hide layer',
};

export const TOOL_LABELS: Record<Exclude<EditorTool, null>, string> = {
	brush: 'Draw brush',
	line: 'Draw line',
	shape: 'Draw shape',
	eraser: 'Erase',
};

export const SHAPE_LABELS: Record<ShapeType, string> = {
	rect: 'Draw rectangle',
	circle: 'Draw circle',
};
