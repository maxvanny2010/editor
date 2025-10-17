import { type HTMLMotionProps, motion } from 'framer-motion';

export const ProjectSkeleton = (props: HTMLMotionProps<'div'>) => (
	<motion.div
		className="relative bg-gray-200 rounded-lg shadow p-4 space-y-3 overflow-hidden"
		role="status"
		{...props}
	>
		<div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
		<div className="relative h-5 bg-gray-300 rounded w-3/4" />
		<div className="relative h-4 bg-gray-300 rounded w-full" />
		<div className="relative h-4 bg-gray-300 rounded w-5/6" />
	</motion.div>
);
