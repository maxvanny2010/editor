import React from 'react';
import { Brush } from 'lucide-react';
import { TOOLS, UI_LABELS } from '@/shared/constants';
import { ToolButton } from '@/widgets/toolbar/ui';
import { BrushFloatingPalette } from '@/entities/brush/model';
import { setActiveTool } from '@/entities/editor/model/slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectActiveTool, selectPaletteOpen } from '@/entities/editor/model/selectors';

export const BrushTool = React.memo(function BrushTool() {
	const dispatch = useAppDispatch();
	const activeTool = useAppSelector(selectActiveTool);
	const paletteOpen = useAppSelector(selectPaletteOpen);
	const isActive = activeTool === TOOLS.BRUSH;

	const handleClick = () => {
		dispatch(setActiveTool(TOOLS.BRUSH));
	};

	return (
		<>
			<ToolButton
				data-testid="brush-tool-button"
				icon={<Brush className="w-5 h-5" />}
				label={UI_LABELS.BRUSH_TOOL}
				active={isActive}
				onClick={handleClick}
			/>
			{isActive && paletteOpen && <BrushFloatingPalette />}
		</>
	);
});
