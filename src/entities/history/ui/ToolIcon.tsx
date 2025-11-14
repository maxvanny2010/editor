import type { EditorTool, ShapeType } from '@/shared/types';
import {
	ICON_COLORS,
	ICON_MAP,
	resolveIconKey,
	type SystemIconName,
} from '@/shared/constants';

export interface ToolIconProps {
	type: EditorTool | null;
	shapeType?: ShapeType;
	iconName?: SystemIconName | string;
	className?: string;
}

export function ToolIcon({ type, shapeType, iconName, className }: ToolIconProps) {
	const key = resolveIconKey(type, shapeType, iconName);

	const Icon = ICON_MAP[key as keyof typeof ICON_MAP];
	const color = ICON_COLORS[key as keyof typeof ICON_COLORS] ?? ICON_COLORS.DEFAULT;

	return (
		<div className="p-1 rounded" data-testid="tool-icon">
			<Icon className={`${className || 'w-4 h-4'} ${color}`} />
		</div>
	);
}
