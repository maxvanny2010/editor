import React from 'react';
import { Square } from 'lucide-react';
import { ToolButton } from '@/widgets/toolbar/ui';
import { ShapeFloatingPalette } from '@/entities/shape/model';
import { setActiveTool } from '@/entities/editor/model/slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectActiveTool, selectPaletteOpen } from '@/entities/editor/model/selectors';
import { TOOLS, UI_LABELS } from '@/shared/constants';

export const ShapeTool = React.memo(function ShapeTool() {
	const dispatch = useAppDispatch();
	const activeTool = useAppSelector(selectActiveTool);
	const paletteOpen = useAppSelector(selectPaletteOpen);
	const isActive = activeTool === TOOLS.SHAPE;

	return (
		<>
			<ToolButton
				data-testid="shape-tool-button"
				icon={<Square className="w-5 h-5" />}
				label={UI_LABELS.SHAPE_TOOL}
				active={isActive}
				onClick={() => dispatch(setActiveTool(TOOLS.SHAPE))}
			/>
			{isActive && paletteOpen && <ShapeFloatingPalette />}
		</>
	);
});
