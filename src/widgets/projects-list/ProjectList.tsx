import { AnimatePresence, motion } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';
import { PROJECT_STATE } from '@/shared/constants';
import { ProjectSkeleton } from './ProjectSkeleton';
import { useDelayedSkeleton } from '@/shared/lib/hooks';
import { projectsSelectors } from '@/entities/project/model/selectors';
import { ProjectCard, ProjectEmptyState } from '@/entities/project/ui';
import { useFetchProjectsOnMount } from '@/features/project-list/model';

export const ProjectList = () => {
	const projects = useAppSelector(projectsSelectors.selectAll);
	const loading = useAppSelector((s) => s.projects.loading);

	useFetchProjectsOnMount(projects.length);
	const showSkeletons = useDelayedSkeleton(loading === PROJECT_STATE.PENDING);

	const isEmpty =
		projects.length === 0 &&
		(loading === PROJECT_STATE.IDLE || loading === PROJECT_STATE.SUCCEEDED);

	const fade = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	};

	return (
		<div className="relative min-h-[200px]" data-testid="project-list">
			<AnimatePresence mode="wait">
				{showSkeletons && (
					<motion.div
						key="skeletons"
						{...fade}
						transition={{ duration: 0.4 }}
						className="grid gap-4"
					>
						{Array.from({ length: 6 }).map((_, i) => (
							<ProjectSkeleton key={i} data-testid="skeleton" />
						))}
					</motion.div>
				)}

				{isEmpty && !showSkeletons && (
					<motion.div key="empty" {...fade} transition={{ duration: 0.3 }}>
						<ProjectEmptyState data-testid="empty-state" />
					</motion.div>
				)}

				{!isEmpty && !showSkeletons && (
					<motion.div
						key="cards"
						{...fade}
						transition={{ duration: 0.4 }}
						className="grid gap-4"
					>
						{projects.map((p) => (
							<ProjectCard
								key={p.id}
								project={p}
								data-testid="project-card"
							/>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
