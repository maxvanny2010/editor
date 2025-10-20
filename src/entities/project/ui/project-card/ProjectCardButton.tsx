import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface ProjectCardButtonProps {
	label: string;
	icon: ReactNode;
	color: 'indigo' | 'rose';
	onClick: () => void;
	testId: string;
}

export function ProjectCardButton({
	label,
	icon,
	color,
	onClick,
	testId,
}: ProjectCardButtonProps) {
	const [hovered, setHovered] = useState(false);

	const colorMap = {
		indigo: {
			text: 'text-indigo-600 hover:text-indigo-700',
			bg: 'from-indigo-400/20 to-indigo-500/20',
		},
		rose: {
			text: 'text-rose-600 hover:text-rose-700',
			bg: 'from-rose-400/20 to-rose-500/20',
		},
	};

	const colors = colorMap[color];

	return (
		<motion.button
			aria-label={`${label.toLowerCase()} project`}
			data-testid={testId}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.96 }}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onClick={onClick}
			className={`relative group flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md overflow-hidden cursor-pointer transition-all duration-300 focus:outline-none ${colors.text}`}
		>
			<span className="relative z-10 flex items-center gap-1">
				{label}
				<AnimatePresence>{hovered && icon}</AnimatePresence>
			</span>

			<span
				className={`absolute inset-0 bg-gradient-to-r ${colors.bg} opacity-0 group-hover:opacity-60 blur-md transition-opacity rounded-md`}
			/>
		</motion.button>
	);
}
