import { motion } from 'framer-motion';

export const CheckIcon = () => {
	return (
		<motion.svg
			key="check"
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
			<path d="M5 13l4 4L19 7" />
		</motion.svg>
	);
};
