import { motion } from 'framer-motion';

export const EditIcon = () => {
	return (
		<motion.svg
			key="pencil"
			initial={{ opacity: 0, x: -4 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -4 }}
			transition={{ duration: 0.15 }}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-4 h-4 text-indigo-500 drop-shadow-sm"
		>
			<path d="M12 20h9" />
			<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
		</motion.svg>
	);
};
