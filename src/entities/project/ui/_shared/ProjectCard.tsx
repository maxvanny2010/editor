import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import type { Project } from '@/shared/types';
import { PROJECT_PATHS } from '@/shared/constants';
import { projectService } from '@/entities/project/model';
import { activeProjectService } from '@/entities/settings/model';
import { ProjectCardButton, ProjectCardDates } from '@/entities/project/ui/project-card';
import {
	CheckIcon,
	EditIcon,
	OpenIcon,
	TrashIcon,
} from '@/entities/project/ui/_shared/ui/icon';

export type ProjectCardData = Pick<Project, 'id' | 'name' | 'createdAt' | 'updatedAt'> & {
	createdAt: number | string | Date;
	updatedAt: number | string | Date;
};

export const ProjectCard = React.memo(function ProjectCard({
	project,
	onEditClick,
	onDeleteClick,
	'data-testid': testId = 'project-card',
}: {
	project?: ProjectCardData;
	onEditClick?: (project: ProjectCardData) => void;
	onDeleteClick?: (project: ProjectCardData) => void;
	'data-testid'?: string;
}) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [flipped, setFlipped] = useState(false);
	const [shake, setShake] = useState(false);
	const [showBack, setShowBack] = useState(false);

	const triggerShakeAndFlip = () => {
		setShake(true);
		setTimeout(() => {
			setShake(false);
			setShowBack(true);
			setFlipped(true);
		}, 400);
	};

	const handleOpenClick = async () => {
		if (!project?.id) {
			triggerShakeAndFlip();
			return;
		}

		try {
			const existingProject = await projectService.getById(project.id);
			if (!existingProject) {
				triggerShakeAndFlip();
				return;
			}
			await activeProjectService.setActiveProject(dispatch, project.id);
			navigate(PROJECT_PATHS.EDITOR_BY_ID(project.id));
		} catch {
			triggerShakeAndFlip();
		}
	};

	const handleOk = () => {
		setFlipped(false);
		setTimeout(() => setShowBack(false), 600);
	};

	return (
		<div
			className="relative w-full max-w-[280px] h-[200px] perspective-[1000px]"
			data-testid={testId}
		>
			{/* FRONT SIDE */}
			<motion.div
				animate={
					shake
						? { x: [-4, 4, -3, 3, -2, 2, 0] }
						: flipped
							? { rotateY: 180 }
							: { rotateY: 0 }
				}
				transition={{
					duration: shake ? 0.4 : 0.6,
					ease: 'easeInOut',
				}}
				className="absolute w-full h-full backface-hidden"
			>
				<div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-md rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 w-full h-full">
					<div>
						<h3 className="text-lg font-semibold text-gray-900 mb-3 truncate">
							{project?.name ?? 'Unknown project'}
						</h3>
						<div className="w-10 border-t border-indigo-500 mb-4" />
						{project && (
							<ProjectCardDates
								createdAt={project.createdAt}
								updatedAt={project.updatedAt}
							/>
						)}
					</div>

					<div className="flex justify-between items-center mt-5">
						{/* OPEN BUTTON */}
						<ProjectCardButton
							label="Open"
							testId={`open-button-${project?.id ?? 'unknown'}`}
							color="indigo"
							onClick={handleOpenClick}
							icon={<OpenIcon />}
						/>

						<ProjectCardButton
							label="Update"
							testId={`update-button-${project?.id ?? 'unknown'}`}
							color="indigo"
							onClick={() => project && onEditClick?.(project)}
							icon={<EditIcon />}
						/>

						<ProjectCardButton
							label="Delete"
							testId={`delete-button-${project?.id ?? 'unknown'}`}
							color="rose"
							onClick={() => project && onDeleteClick?.(project)}
							icon={<TrashIcon />}
						/>
					</div>
				</div>
			</motion.div>

			{/* BACK SIDE */}
			{showBack && (
				<motion.div
					initial={{ rotateY: 180 }}
					animate={{ rotateY: flipped ? 0 : 180 }}
					transition={{ duration: 0.6 }}
					className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)]"
				>
					<div className="flex flex-col justify-center items-center bg-rose-50 border border-rose-200 rounded-2xl w-full h-full text-center p-4">
						<p className="text-rose-600 font-semibold mb-3">
							Project {project?.name ?? 'Unknown'} not found
						</p>
						<ProjectCardButton
							label="OK"
							testId={`ok-button-${project?.id ?? 'unknown'}`}
							color="rose"
							onClick={handleOk}
							icon={<CheckIcon />}
						/>
					</div>
				</motion.div>
			)}
		</div>
	);
});
