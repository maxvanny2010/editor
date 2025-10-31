import { motion } from 'framer-motion';
import { ViewportButton } from '@/shared/shared/ui/buttons/ViewportButton';

export const ViewportControls = ({
	scale,
	offsetX,
	offsetY,
	onReset,
	onFit,
	onToggleGrid,
	showGrid,
	isLayersOpen,
}: {
	scale: number;
	offsetX: number;
	offsetY: number;
	onReset: () => void;
	onFit: () => void;
	onToggleGrid: () => void;
	showGrid: boolean;
	isLayersOpen?: boolean;
}) => (
	<motion.div
		animate={{
			right: isLayersOpen ? 304 : 12,
		}}
		transition={{
			type: 'spring',
			stiffness: 200,
			damping: 22,
		}}
		className="absolute bottom-3 flex gap-2 items-center text-xs text-gray-700 dark:text-gray-300"
	>
		<div className="bg-white/70 dark:bg-gray-800/70 px-2 py-1 rounded-md">
			Zoom: {(scale * 100).toFixed(0)}% | Offset: {offsetX}, {offsetY}
		</div>

		<ViewportButton label="Reset" onClick={onReset} testId="reset-button-testid" />
		<ViewportButton label="Fit" onClick={onFit} testId="fit-button-testid" />
		<ViewportButton
			label={showGrid ? 'Hide Grid' : 'Show Grid'}
			onClick={onToggleGrid}
			active={showGrid}
			testId="grid-button-testid"
		/>
	</motion.div>
);
