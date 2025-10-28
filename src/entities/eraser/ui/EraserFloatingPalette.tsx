import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { TOOL_SIZES } from '@/shared/constants/toolPresets';
import { ToolFloatingPalette } from '@/widgets/toolbar/model';
import { setEraserSize } from '@/entities/eraser/model/slice';

export function EraserFloatingPalette() {
	const dispatch = useAppDispatch();
	const size = useAppSelector((s) => s.eraser.size);

	return (
		<ToolFloatingPalette
			title="Eraser"
			subtitle="Size"
			values={TOOL_SIZES}
			selectedValue={size}
			onValueChange={(v) => dispatch(setEraserSize(v))}
			position="top-72"
			data-testid-prefix="eraser"
		/>
	);
}
