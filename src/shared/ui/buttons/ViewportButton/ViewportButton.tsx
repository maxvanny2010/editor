import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface ViewportButtonProps {
	label: string;
	Icon?: LucideIcon;
	onClick?: () => void;
	active?: boolean;
	testId?: string;
}

/**
 * Universal small control button used in the viewport footer.
 * Harmonized with editor's indigo–slate color scheme.
 */
export const ViewportButton = React.memo(function ViewportButton({
	label,
	Icon,
	onClick,
	active = false,
	testId,
}: ViewportButtonProps) {
	return (
		<motion.button
			whileHover={{ scale: 1.08 }}
			whileTap={{ scale: 0.92 }}
			onClick={onClick}
			data-testid={testId}
			className={`relative flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium
				transition-all select-none focus:outline-none border border-transparent
				${
					active
						? 'text-white bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.6)]'
						: 'text-gray-200 bg-gray-700/60 hover:bg-gray-600/80'
				}`}
		>
			{Icon && <Icon className="w-4 h-4" />}
			<span>{label}</span>

			{/* animated glow effect for active state */}
			{active && (
				<motion.span
					layoutId="glow"
					className="absolute inset-0 rounded-md bg-indigo-500/40 blur-md"
					animate={{ opacity: [0.5, 0.8, 0.5] }}
					transition={{
						duration: 2.5,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>
			)}
		</motion.button>
	);
});
