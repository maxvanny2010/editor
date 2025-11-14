import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setBrushColor, setBrushSize } from '@/entities/brush/model/slice';
import { TOOL_COLORS, TOOL_SIZES } from '@/shared/constants';
import { ToolFloatingPalette } from '@/widgets/toolbar/ui';

export function BrushFloatingPalette() {
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
}
