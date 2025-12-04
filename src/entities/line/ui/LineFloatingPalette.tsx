import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLineColor, setLineThickness } from '@/entities/line/model/slice';
import { TOOL_COLORS, TOOL_SIZES } from '@/shared/constants/toolPresets';
import { ToolFloatingPalette } from '@/widgets/toolbar/ui';

export const LineFloatingPalette = React.memo(function LineFloatingPalette() {
	const dispatch = useAppDispatch();
	const { color, thickness } = useAppSelector((s) => s.line);

	return (
		<ToolFloatingPalette
			title="Line"
			subtitle="Thickness & Color"
			values={TOOL_SIZES}
			colors={TOOL_COLORS}
			selectedValue={thickness}
			selectedColor={color}
			onValueChange={(v) => dispatch(setLineThickness(v))}
			onColorChange={(c) => dispatch(setLineColor(c))}
			position="bottom-19"
		/>
	);
});
