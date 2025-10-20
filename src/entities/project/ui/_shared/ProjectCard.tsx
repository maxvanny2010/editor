import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Project } from '@/shared/types';
import { ProjectCardButton, ProjectCardDates } from '@/entities/project/ui/project-card';
import { PROJECT_PATHS } from '@/shared/constants/projectPaths.ts';

export type ProjectCardData = Pick<Project, 'id' | 'name' | 'createdAt' | 'updatedAt'> & {
	createdAt: number | string | Date;
	updatedAt: number | string | Date;
};

export function ProjectCard({
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

	const handleOpenClick = () => {
		if (!project?.id) {
			triggerShakeAndFlip();
			return;
		}
		navigate(PROJECT_PATHS.EDITOR_BY_ID(project.id));
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
						<ProjectCardButton
							label="Open"
							testId={`open-button-${project?.id ?? 'unknown'}`}
							color="indigo"
							onClick={handleOpenClick}
							icon={
								<motion.svg
									key="open"
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
									<path d="M14 3v4a1 1 0 0 0 1 1h4" />
									<path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H9l-4-4z" />
								</motion.svg>
							}
						/>

						<ProjectCardButton
							label="Update"
							testId={`update-button-${project?.id ?? 'unknown'}`}
							color="indigo"
							onClick={() => project && onEditClick?.(project)}
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
							testId={`delete-button-${project?.id ?? 'unknown'}`}
							color="rose"
							onClick={() => project && onDeleteClick?.(project)}
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
				</div>
			</motion.div>

			{/* BACK SIDE (теперь рендерится только когда нужна) */}
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
							icon={
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
							}
						/>
					</div>
				</motion.div>
			)}
		</div>
	);
}
