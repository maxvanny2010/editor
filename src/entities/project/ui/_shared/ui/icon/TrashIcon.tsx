import { motion } from 'framer-motion';

export const TrashIcon = () => {
	return (
		<motion.svg
			key="trash"
			initial={{ opacity: 0, x: -3, rotate: -15 }}
			animate={{ opacity: 1, x: 0, rotate: 0 }}
			exit={{ opacity: 0, x: -3, rotate: 15 }}
			transition={{ duration: 0.25, ease: 'easeOut' }}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-4 h-4 text-rose-500 drop-shadow-sm"
		>
			<polyline points="3 6 5 6 21 6" />
			<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3-3h8a1 1 0 0 1 1 1v2H7V4a1 1 0 0 1 1-1z" />
		</motion.svg>
	);
};
