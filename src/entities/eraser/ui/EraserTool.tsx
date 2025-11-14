import { Eraser } from 'lucide-react';
import { ToolButton } from '@/widgets/toolbar/ui';
import { EraserFloatingPalette } from './EraserFloatingPalette';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveTool } from '@/entities/editor/model/slice';
import { selectActiveTool, selectPaletteOpen } from '@/entities/editor/model/selectors';

export function EraserTool() {
	const dispatch = useAppDispatch();
	const activeTool = useAppSelector(selectActiveTool);
	const paletteOpen = useAppSelector(selectPaletteOpen);
	const isActive = activeTool === 'eraser';

	const handleClick = () => {
		dispatch(setActiveTool('eraser'));
	};

	return (
		<>
			<ToolButton
				data-testid="eraser-tool-button"
				icon={<Eraser className="w-5 h-5" />}
				label="Eraser Tool"
				active={isActive}
				onClick={handleClick}
			/>
			{isActive && paletteOpen && <EraserFloatingPalette />}
		</>
	);
}
