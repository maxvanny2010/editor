import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ToolBarProps {
	children?: ReactNode;
	position?: 'bottom' | 'left';
}

export function ToolBar({ children, position = 'left' }: ToolBarProps) {
	const isBottom = position === 'bottom';
	const baseClasses = `
    fixed z-40 flex
    ${
		isBottom
			? 'bottom-4 left-1/2 -translate-x-1/2 flex-row'
			: 'top-1/2 left-4 -translate-y-1/2 flex-col'
	}
    items-center gap-3 rounded-2xl border border-gray-200 bg-white/90 shadow-xl backdrop-blur-sm
    ${isBottom ? 'px-4 py-2 min-w-[200px] min-h-[56px]' : 'px-2 py-4 w-[60px] min-h-[300px]'}
  `;

	return (
		<AnimatePresence>
			<motion.div
				role="toolbar"
				className={baseClasses}
				initial={{ opacity: 0, x: isBottom ? 0 : -20, y: isBottom ? 10 : 0 }}
				animate={{ opacity: 1, x: 0, y: 0 }}
				exit={{ opacity: 0, x: isBottom ? 0 : -20, y: isBottom ? 10 : 0 }}
				transition={{ duration: 0.25, ease: 'easeOut' }}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
