import React from 'react';
import { Slash } from 'lucide-react';
import { ToolButton } from '@/widgets/toolbar/ui';
import { LineFloatingPalette } from '@/entities/line/model';
import { setActiveTool } from '@/entities/editor/model/slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectActiveTool, selectPaletteOpen } from '@/entities/editor/model/selectors';
import { TOOLS, UI_LABELS } from '@/shared/constants';

export const LineTool = React.memo(function LineTool() {
	const dispatch = useAppDispatch();
	const activeTool = useAppSelector(selectActiveTool);
	const paletteOpen = useAppSelector(selectPaletteOpen);
	const isActive = activeTool === TOOLS.LINE;

	const handleClick = () => {
		dispatch(setActiveTool(TOOLS.LINE));
	};

	return (
		<>
			<ToolButton
				data-testid="line-tool-button"
				icon={<Slash className="w-5 h-5" />}
				label={UI_LABELS.LINE_TOOL}
				active={isActive}
				onClick={handleClick}
			/>
			{isActive && paletteOpen && <LineFloatingPalette />}
		</>
	);
});
