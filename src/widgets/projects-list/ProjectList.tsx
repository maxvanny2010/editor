import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';
import { PROJECT_STATE } from '@/shared/constants';
import { useDelayedSkeleton } from '@/shared/lib/hooks';
import { useFetchProjectsOnMount } from '@/features/project-list/model';
import { projectsSelectors } from '@/entities/project/model/selectors';
import {
	ProjectCard,
	type ProjectCardData,
	ProjectEmptyState,
} from '@/entities/project/ui';
import { UpdateProjectModal } from '@/features/project-update/model';
import { DeleteProjectModal } from '@/features/project-delete/model';
import { ProjectSkeleton } from '@/widgets/projects-list';

/**
 * Displays a responsive grid of project cards.
 * Handles loading, empty states, and edit modal rendering.
 */
export const ProjectList = () => {
	const projects = useAppSelector(projectsSelectors.selectAll);
	const loading = useAppSelector((s) => s.projects.loading);

	const [editingProject, setEditingProject] = useState<ProjectCardData | null>(null);
	const [deletingProject, setDeletingProject] = useState<ProjectCardData | null>(null);

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

	const gridClasses =
		'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center';

	// ───────── SKELETONS ─────────
	if (showSkeletons) {
		return (
			<div className="relative min-h-[400px]" data-testid="project-list">
				<motion.div
					key="skeletons"
					{...fade}
					transition={{ duration: 0.4 }}
					className={gridClasses}
				>
					{Array.from({ length: 12 }).map((_, i) => (
						<div key={i} className="w-full max-w-[280px]">
							<ProjectSkeleton data-testid="skeleton" />
						</div>
					))}
				</motion.div>
			</div>
		);
	}

	// ───────── EMPTY STATE ─────────
	if (isEmpty) {
		return (
			<div className="relative min-h-[400px]" data-testid="project-list">
				<motion.div key="empty" {...fade} transition={{ duration: 0.3 }}>
					<ProjectEmptyState data-testid="empty-state" />
				</motion.div>
			</div>
		);
	}

	// ───────── PROJECT CARDS + MODALS ─────────
	return (
		<div className="relative min-h-[400px]" data-testid="project-list">
			<AnimatePresence mode="wait">
				<motion.div
					key="cards"
					{...fade}
					transition={{ duration: 0.4 }}
					className={gridClasses}
				>
					{projects.map((project) => (
						<div key={project.id} className="w-full max-w-[280px]">
							<ProjectCard
								project={project}
								data-testid="project-card"
								onEditClick={setEditingProject}
								onDeleteClick={setDeletingProject}
							/>
						</div>
					))}
				</motion.div>
			</AnimatePresence>

			{editingProject && (
				<UpdateProjectModal
					projectId={editingProject.id}
					initialName={editingProject.name}
					onClose={() => setEditingProject(null)}
				/>
			)}

			{deletingProject && (
				<DeleteProjectModal
					projectId={deletingProject.id}
					projectName={deletingProject.name}
					onClose={() => setDeletingProject(null)}
				/>
			)}
		</div>
	);
};
