import { AnimatePresence, motion } from 'framer-motion';
import { Plus as PlusIcon } from 'lucide-react';
import React, { useState } from 'react';

interface AddLayerButtonProps {
	onCreate: () => void;
	disabled?: boolean;
}

export const AddLayerButton = React.memo(function AddLayerButton({
	onCreate,
	disabled,
}: AddLayerButtonProps) {
	const [hoverAdd, setHoverAdd] = useState(false);

	return (
		<button
			onClick={() => !disabled && onCreate()}
			disabled={disabled}
			onMouseEnter={() => setHoverAdd(true)}
			onMouseLeave={() => setHoverAdd(false)}
			className="
                relative text-sm font-medium text-indigo-600
                flex items-center gap-2 self-start mt-1
                px-3 py-2 rounded-md border border-indigo-200 bg-indigo-50/70
                hover:bg-indigo-100 hover:border-indigo-300 transition-all
            "
		>
			{/* Animated '+' icon on hover using Framer Motion (AnimatePresence) */}
			<AnimatePresence mode="wait">
				{hoverAdd && (
					<motion.span
						key="plus"
						initial={{
							opacity: 0,
							rotate: -90,
							x: -6,
							scale: 0.8,
						}}
						animate={{
							opacity: 1,
							rotate: 0,
							x: 0,
							scale: 1,
						}}
						exit={{
							opacity: 0,
							rotate: 90,
							x: -6,
							scale: 0.8,
						}}
						transition={{ duration: 0.25 }}
						className="flex items-center justify-center"
					>
						<PlusIcon className="w-4 h-4 text-indigo-600" />
					</motion.span>
				)}
			</AnimatePresence>
			<span>Add Layer</span>
		</button>
	);
});
