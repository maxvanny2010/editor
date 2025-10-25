import { Brush } from 'lucide-react';
import { BrushFloatingPalette } from '@/entities/brush/model';
import { setActiveTool } from '@/entities/editor/model/slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectActiveTool } from '@/entities/editor/model/selectors';
import { ToolButton } from '@/widgets/toolbar/model';

export function BrushTool() {
	const dispatch = useAppDispatch();
	const activeTool = useAppSelector(selectActiveTool);
	const isActive = activeTool === 'brush';

	const handleClick = () => {
		dispatch(setActiveTool(isActive ? null : 'brush'));
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
			{isActive && <BrushFloatingPalette />}
		</>
	);
}
