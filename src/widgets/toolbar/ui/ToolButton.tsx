import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ToolButtonProps {
	icon: ReactNode;
	label: string;
	active?: boolean;
	onClick?: () => void;
}

export function ToolButton({ icon, label, active, onClick }: ToolButtonProps) {
	return (
		<motion.button
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
			onClick={onClick}
			aria-label={label}
			className={`
        relative flex items-center justify-center w-10 h-10 rounded-full
        transition-all
        ${active ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-700'}
      `}
		>
			{icon}
			{active && (
				<motion.div
					layoutId="activeTool"
					className="absolute inset-0 rounded-full border-2 border-indigo-500"
				/>
			)}
		</motion.button>
	);
}
