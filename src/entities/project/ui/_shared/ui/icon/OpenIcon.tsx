import { motion } from 'framer-motion';

export const OpenIcon = () => {
	return (
		<motion.svg
			key="open"
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
			<path d="M14 3v4a1 1 0 0 0 1 1h4" />
			<path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H9l-4-4z" />
		</motion.svg>
	);
};
