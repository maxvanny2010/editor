import { motion } from 'framer-motion';

export const CanvasSkeleton = () => (
	<div className="flex-1 flex items-center justify-center">
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.4 }}
			className="relative w-[70%] h-[75%] rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow-lg overflow-hidden"
		>
			<div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 animate-pulse" />
		</motion.div>
	</div>
);
