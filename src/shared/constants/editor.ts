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
