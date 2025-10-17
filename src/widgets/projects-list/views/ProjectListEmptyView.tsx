import React from 'react';
import { motion } from 'framer-motion';
import { ProjectEmptyState } from '@/entities/project/ui';

const ProjectListEmptyViewComponent = () => (
	<div className="relative min-h-[400px]" data-testid="project-list">
		<motion.div
			key="empty"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			<ProjectEmptyState data-testid="empty-state" />
		</motion.div>
	</div>
);

export const ProjectListEmptyView = React.memo(ProjectListEmptyViewComponent);
