import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { TOOL_SIZES } from '@/shared/constants/toolPresets';
import { ToolFloatingPalette } from '@/widgets/toolbar/ui';
import { setEraserSize } from '@/entities/eraser/model/slice';
import { selectEraserSize } from '@/entities/eraser/model';
import { UI_LABELS } from '@/shared/constants';

export function EraserFloatingPalette() {
	const dispatch = useAppDispatch();
	const size = useAppSelector(selectEraserSize);

	return (
		<ToolFloatingPalette
			title={UI_LABELS.ERASER_TOOL}
			subtitle={UI_LABELS.ERASER_TOOL_SIZE}
			values={TOOL_SIZES}
			selectedValue={size}
			onValueChange={(v) => dispatch(setEraserSize(v))}
			position="bottom-43"
			data-testid-prefix="eraser"
		/>
	);
}
