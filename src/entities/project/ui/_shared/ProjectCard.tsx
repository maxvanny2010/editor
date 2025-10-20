import { motion } from 'framer-motion';
import type { Project } from '@/shared/types';
import { ProjectCardButton, ProjectCardDates } from '@/entities/project/ui/project-card';

export type ProjectCardData = Pick<Project, 'id' | 'name' | 'createdAt' | 'updatedAt'> & {
	createdAt: number | string | Date;
	updatedAt: number | string | Date;
};

export function ProjectCard({
	project,
	onEditClick,
	onDeleteClick,
}: {
	project: ProjectCardData;
	onEditClick?: (project: ProjectCardData) => void;
	onDeleteClick?: (project: ProjectCardData) => void;
}) {
	return (
		<motion.div
			data-testid="project-card"
			whileHover={{ y: -4 }}
			className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-md rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 w-full max-w-[280px]"
		>
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-3 truncate">
					{project.name}
				</h3>
				<div className="w-10 border-t border-indigo-500 mb-4" />
				<ProjectCardDates
					createdAt={project.createdAt}
					updatedAt={project.updatedAt}
				/>
			</div>

			<div className="flex justify-between items-center mt-5">
				<ProjectCardButton
					label="Update"
					testId={`update-button-${project.id}`}
					color="indigo"
					onClick={() => onEditClick?.(project)}
					icon={
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
					}
				/>
				<ProjectCardButton
					label="Delete"
					testId={`delete-button-${project.id}`}
					color="rose"
					onClick={() => onDeleteClick?.(project)}
					icon={
						<motion.svg
							key="trash"
							initial={{ opacity: 0, x: -3, rotate: -15 }}
							animate={{ opacity: 1, x: 0, rotate: 0 }}
							exit={{ opacity: 0, x: -3, rotate: 15 }}
							transition={{ duration: 0.25, ease: 'easeOut' }}
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-4 h-4 text-rose-500 drop-shadow-sm"
						>
							<polyline points="3 6 5 6 21 6" />
							<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3-3h8a1 1 0 0 1 1 1v2H7V4a1 1 0 0 1 1-1z" />
						</motion.svg>
					}
				/>
			</div>
		</motion.div>
	);
}
