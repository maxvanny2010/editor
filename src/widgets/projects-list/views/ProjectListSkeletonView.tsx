import React from 'react';
import { motion } from 'framer-motion';
import { ProjectSkeleton } from '@/widgets/projects-list';

const ProjectListSkeletonViewComponent = () => (
	<div className="relative min-h-[400px]" data-testid="project-list">
		<motion.div
			key="skeletons"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4 }}
			className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center"
		>
			{Array.from({ length: 12 }).map((_, i) => (
				<div key={i} className="w-full max-w-[280px]">
					<ProjectSkeleton data-testid="skeleton" />
				</div>
			))}
		</motion.div>
	</div>
);

export const ProjectListSkeletonView = React.memo(ProjectListSkeletonViewComponent);
