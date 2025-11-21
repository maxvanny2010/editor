import { type HTMLMotionProps, motion } from 'framer-motion';
import React, { type ReactNode } from 'react';

interface ToolButtonProps extends HTMLMotionProps<'button'> {
	icon: ReactNode;
	label: string;
	active?: boolean;
}

export const ToolButton = React.memo(function ToolButton({
	icon,
	label,
	active,
	onClick,
	...rest
}: ToolButtonProps) {
	return (
		<motion.button
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
			onClick={onClick}
			aria-label={label}
			{...rest}
			className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
				active
					? 'bg-indigo-100 text-indigo-600'
					: 'hover:bg-gray-100 text-gray-700'
			}`}
		>
			{icon}
			{active && (
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="absolute inset-0 rounded-full border-2 border-indigo-500"
				/>
			)}
		</motion.button>
	);
});
