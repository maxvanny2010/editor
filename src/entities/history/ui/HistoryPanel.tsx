import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { UI_LABELS } from '@/shared/constants';
import type { HistoryEntry } from '@/shared/types';
import { Hand, X as CloseIcon } from 'lucide-react';
import { ToolIcon } from './ToolIcon';
import { selectHistory } from '@/entities/history/model/selectors';
import { jumpTo } from '@/entities/history/model/slice';
import { RedoButton, UndoButton } from '@/widgets/toolbar/ui';
import type { HistoryEntryExt } from '@/entities/layer/model';
import {
	HistoryApplySnapshotButton,
	HistoryExitPreviewButton,
} from '@/shared/ui/buttons';

interface HistoryPanelProps {
	open: boolean;
	onClose: () => void;
}

type AnyHistoryEntry = (HistoryEntry & Partial<HistoryEntryExt>) & {
	icon?: string;
	toolType?: HistoryEntry['toolType'];
	shapeType?: HistoryEntry['shapeType'];
};

export function HistoryPanel({ open, onClose }: HistoryPanelProps) {
	const dispatch = useAppDispatch();
	const history = useAppSelector(selectHistory);
	const isPreview = useAppSelector((s) => s.history.isPreview);

	if (!open) return null;
	if (!history || !Array.isArray(history.stack)) {
		return <div className="p-2 text-red-500">History load error</div>;
	}

	return (
		<motion.aside
			initial={{ x: '100%', opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: '100%', opacity: 0 }}
			transition={{ type: 'spring', stiffness: 220, damping: 25 }}
			className="fixed top-0 right-16 bottom-16 w-72 border-l border-gray-200 bg-white/90 backdrop-blur-sm shadow-xl p-3 flex flex-col gap-3 z-40"
		>
			{/* Header */}
			<header className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-gray-800">
					History{' '}
					{isPreview && <span className="text-amber-600 ml-1">(Preview)</span>}
				</h3>

				<button
					onClick={onClose}
					className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
					aria-label="Close panel"
				>
					<CloseIcon className="w-4 h-4" />
				</button>
			</header>

			{/* Undo / Redo */}
			<div className="flex gap-2">
				<UndoButton />
				<RedoButton />
			</div>

			{/* PREVIEW MODE CONTROLS */}
			{isPreview && (
				<motion.div
					initial={{ opacity: 0, y: -6 }}
					animate={{ opacity: 1, y: 0 }}
					className="flex flex-col gap-2"
				>
					<div className="flex items-center gap-1 text-xs text-gray-500">
						<Hand className="w-4 h-4 text-amber-600 animate-bounce" />
						<span>Click to confirm or exit preview</span>
					</div>

					<div className="flex gap-2">
						<HistoryApplySnapshotButton />
						<HistoryExitPreviewButton />
					</div>
				</motion.div>
			)}

			{/* HISTORY LIST */}
			<ul className="flex-1 overflow-y-auto border-t border-gray-100 mt-2 space-y-1">
				<AnimatePresence initial={false}>
					{(history.stack as AnyHistoryEntry[]).map((entry, idx) => {
						const isActive = idx === history.currentIndex;
						const { icon, toolType, shapeType } = entry;

						return (
							<motion.li
								key={entry.id}
								layout
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -8 }}
								transition={{ duration: 0.25 }}
								onClick={() => dispatch(jumpTo(idx))}
								className={`cursor-pointer text-sm flex items-center gap-2 px-2 py-1.5 rounded-md truncate transition-all ${
									isActive
										? 'bg-amber-100 text-amber-700 font-medium'
										: 'hover:bg-gray-50 text-gray-700'
								}`}
								title={entry.label}
							>
								<ToolIcon
									type={toolType ?? null}
									shapeType={shapeType}
									iconName={icon}
								/>

								<span className="truncate">
									{entry.label || UI_LABELS.NAME(idx + 1)}
								</span>
							</motion.li>
						);
					})}
				</AnimatePresence>
			</ul>
		</motion.aside>
	);
}
