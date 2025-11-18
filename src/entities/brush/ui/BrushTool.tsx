import { Brush } from 'lucide-react';
import { TOOLS } from '@/shared/constants';
import { ToolButton } from '@/widgets/toolbar/ui';
import { BrushFloatingPalette } from '@/entities/brush/model';
import { setActiveTool } from '@/entities/editor/model/slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectActiveTool, selectPaletteOpen } from '@/entities/editor/model/selectors';

export function BrushTool() {
	const dispatch = useAppDispatch();
	const activeTool = useAppSelector(selectActiveTool);
	const paletteOpen = useAppSelector(selectPaletteOpen);
	const isActive = activeTool === 'brush';

	const handleClick = () => {
		dispatch(setActiveTool(TOOLS.BRUSH));
	};

	return (
		<>
			<ToolButton
				data-testid="brush-tool-button"
				icon={<Brush className="w-5 h-5" />}
				label="Brush Tool"
				active={isActive}
				onClick={handleClick}
			/>
			{isActive && paletteOpen && <BrushFloatingPalette />}
		</>
	);
}
