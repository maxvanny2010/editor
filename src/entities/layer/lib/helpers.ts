import { SHAPE_LABELS, SHAPES, TOOL_LABELS, TOOLS, UI_LABELS } from '@/shared/constants';
import type { EditorTool, ShapeType } from '@/shared/types';

export function buildHistoryLabel(activeTool: EditorTool, shapeType?: ShapeType): string {
	if (activeTool === TOOLS.SHAPE) {
		return shapeType === SHAPES.CIRCLE ? SHAPE_LABELS.circle : SHAPE_LABELS.rect;
	}

	if (activeTool) {
		return TOOL_LABELS[activeTool];
	}

	return UI_LABELS.SNAPSHOT;
}
