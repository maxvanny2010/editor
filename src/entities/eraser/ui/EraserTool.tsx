import { Eraser } from 'lucide-react';
import { ToolButton } from '@/widgets/toolbar/ui';
import { EraserFloatingPalette } from './EraserFloatingPalette';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveTool } from '@/entities/editor/model/slice';
import { selectActiveTool, selectPaletteOpen } from '@/entities/editor/model/selectors';
import { TOOLS, UI_LABELS } from '@/shared/constants';

export function EraserTool() {
	const dispatch = useAppDispatch();
	const activeTool = useAppSelector(selectActiveTool);
	const paletteOpen = useAppSelector(selectPaletteOpen);
	const isActive = activeTool === TOOLS.ERASER;

	const handleClick = () => {
		dispatch(setActiveTool(TOOLS.ERASER));
	};

	return (
		<>
			<ToolButton
				data-testid="eraser-tool-button"
				icon={<Eraser className="w-5 h-5" />}
				label={UI_LABELS.ERASER_TOOL}
				active={isActive}
				onClick={handleClick}
			/>
			{isActive && paletteOpen && <EraserFloatingPalette />}
		</>
	);
}
