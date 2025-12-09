import React from 'react';
import { ToolFloatingPalette } from '@/widgets/toolbar/ui';
import { TOOL_COLORS, TOOL_SIZES, UI_LABELS } from '@/shared/constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setBrushColor, setBrushSize } from '@/entities/brush/model/slice';
import { selectBrushState } from '@/entities/brush/model';

export const BrushFloatingPalette = React.memo(function BrushFloatingPalette() {
	const dispatch = useAppDispatch();
	const { color, size } = useAppSelector(selectBrushState);

	return (
		<ToolFloatingPalette
			title={UI_LABELS.BRUSH_TOOL}
			subtitle={UI_LABELS.BRUSH_TOOL_SUB}
			values={TOOL_SIZES}
			colors={TOOL_COLORS}
			selectedValue={size}
			selectedColor={color}
			onValueChange={(v) => dispatch(setBrushSize(v))}
			onColorChange={(c) => dispatch(setBrushColor(c))}
			position="bottom-19"
		/>
	);
});
