import { ViewportButton } from '@/shared/shared/ui/buttons/ViewportButton';

export const ViewportControls = ({
	scale,
	offsetX,
	offsetY,
	onReset,
	onFit,
}: {
	scale: number;
	offsetX: number;
	offsetY: number;
	onReset: () => void;
	onFit: () => void;
}) => (
	<div className="absolute bottom-3 right-3 flex gap-2 items-center text-xs text-gray-700 dark:text-gray-300">
		<div className="bg-white/70 dark:bg-gray-800/70 px-2 py-1 rounded-md">
			Zoom: {(scale * 100).toFixed(0)}% | Offset: {offsetX}, {offsetY}
		</div>

		<ViewportButton label="Reset" onClick={onReset} testId="reset-button-testid" />
		<ViewportButton label="Fit" onClick={onFit} testId="fit-button-testid" />
	</div>
);
