import { Square } from 'lucide-react';
import { ToolButton } from '@/widgets/toolbar/model';
import { ShapeFloatingPalette } from '@/entities/shape/model';
import { setActiveTool } from '@/entities/editor/model/slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectActiveTool, selectPaletteOpen } from '@/entities/editor/model/selectors';

export function ShapeTool() {
	const dispatch = useAppDispatch();
	const activeTool = useAppSelector(selectActiveTool);
	const paletteOpen = useAppSelector(selectPaletteOpen);
	const isActive = activeTool === 'shape';

	return (
		<>
			<ToolButton
				data-testid="shape-tool-button"
				icon={<Square className="w-5 h-5" />}
				label="Shape Tool"
				active={isActive}
				onClick={() => dispatch(setActiveTool('shape'))}
			/>
			{isActive && paletteOpen && <ShapeFloatingPalette />}
		</>
	);
}
