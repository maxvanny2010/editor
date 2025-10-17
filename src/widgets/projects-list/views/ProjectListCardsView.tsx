import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProjectCard, type ProjectCardData } from '@/entities/project/ui';
import { UpdateProjectModal } from '@/features/project-update/model';
import { DeleteProjectModal } from '@/features/project-delete/model';

interface Props {
	projects: ProjectCardData[];
}

const fadeVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

const gridClasses =
	'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center';

function renderCard(
	project: ProjectCardData,
	onEdit: (p: ProjectCardData) => void,
	onDelete: (p: ProjectCardData) => void,
) {
	return (
		<div key={project.id} className="w-full max-w-[280px]">
			<ProjectCard
				project={project}
				data-testid="project-card"
				onEditClick={onEdit}
				onDeleteClick={onDelete}
			/>
		</div>
	);
}
export const ProjectListCardsViewComponent = ({ projects }: Props) => {
	const [editingProject, setEditingProject] = useState<ProjectCardData | null>(null);
	const [deletingProject, setDeletingProject] = useState<ProjectCardData | null>(null);
	const handleCloseEdit = () => setEditingProject(null);
	const handleCloseDelete = () => setDeletingProject(null);
	return (
		<div className="relative min-h-[400px]" data-testid="project-list">
			<AnimatePresence mode="wait">
				<motion.div
					key="cards"
					{...fadeVariants}
					transition={{ duration: 0.4 }}
					className={gridClasses}
				>
					{projects.map((p) =>
						renderCard(p, setEditingProject, setDeletingProject),
					)}
				</motion.div>
			</AnimatePresence>

			{editingProject && (
				<UpdateProjectModal
					projectId={editingProject.id}
					initialName={editingProject.name}
					onClose={handleCloseEdit}
				/>
			)}

			{deletingProject && (
				<DeleteProjectModal
					projectId={deletingProject.id}
					projectName={deletingProject.name}
					onClose={handleCloseDelete}
				/>
			)}
		</div>
	);
};
export const ProjectListCardsView = React.memo(ProjectListCardsViewComponent);
