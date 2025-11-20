import React from 'react';
import { ToolFloatingPalette } from '@/widgets/toolbar/ui';
import { TOOL_COLORS, TOOL_SIZES } from '@/shared/constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setBrushColor, setBrushSize } from '@/entities/brush/model/slice';

export const BrushFloatingPalette = React.memo(function BrushFloatingPalette() {
	const dispatch = useAppDispatch();
	const { color, size } = useAppSelector((s) => s.brush);

	return (
		<ToolFloatingPalette
			title="Brush"
			subtitle="Size & Color"
			values={TOOL_SIZES}
			colors={TOOL_COLORS}
			selectedValue={size}
			selectedColor={color}
			onValueChange={(v) => dispatch(setBrushSize(v))}
			onColorChange={(c) => dispatch(setBrushColor(c))}
			position="top-24"
		/>
	);
});
