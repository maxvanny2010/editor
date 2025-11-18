import { motion } from 'framer-motion';
import { Grid3X3, Maximize2, Minimize2, Redo2, Undo2 } from 'lucide-react';
import { ViewportButton } from '@/shared/ui/buttons';
import { UI_LABELS } from '@/shared/constants';

interface BottomFooterProps {
	scale: number;
	offsetX: number;
	offsetY: number;
	onUndo?: () => void;
	onRedo?: () => void;
	onReset: () => void;
	onFit: () => void;
	onToggleGrid: () => void;
	showGrid: boolean;
}

/**
 * Persistent footer with main viewport controls.
 * Visually separated and always visible.
 */
export function BottomFooter({
	scale,
	offsetX,
	offsetY,
	onUndo,
	onRedo,
	onReset,
	onFit,
	onToggleGrid,
	showGrid,
}: BottomFooterProps) {
	return (
		<motion.footer
			className="
		fixed bottom-0 left-0 right-0 h-16
		bg-gray-900 text-white
		flex items-center justify-between px-6
		border-t border-gray-800
		shadow-[0_-6px_12px_-2px_rgba(0,0,0,0.6)]
		will-change-[box-shadow]
		z-50
	"
			initial={{ y: 80 }}
			animate={{ y: 0 }}
			transition={{ type: 'spring', stiffness: 200, damping: 20 }}
		>
			<div className="text-xs text-gray-400">
				Zoom: {(scale * 100).toFixed(0)}% | Offset: {offsetX}, {offsetY}
			</div>

			<div className="flex gap-3 items-center">
				<ViewportButton
					label="Undo"
					Icon={Undo2}
					onClick={onUndo}
					testId="undo-button-testid"
				/>
				<ViewportButton
					label="Redo"
					Icon={Redo2}
					onClick={onRedo}
					testId="redo-button-testid"
				/>
				<ViewportButton
					label="Fit"
					Icon={Maximize2}
					onClick={onFit}
					testId="fit-button-testid"
				/>
				<ViewportButton
					label="Reset"
					Icon={Minimize2}
					onClick={onReset}
					testId="reset-button-testid"
				/>
				<ViewportButton
					label={showGrid ? UI_LABELS.HIDE_GRID : UI_LABELS.SHOW_GRID}
					Icon={Grid3X3}
					onClick={onToggleGrid}
					active={showGrid}
					testId="grid-button-testid"
				/>
			</div>
		</motion.footer>
	);
}
