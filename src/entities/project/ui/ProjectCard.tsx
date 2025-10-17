import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import type { Project } from '@/shared/types';

export type ProjectCardData = Pick<Project, 'id' | 'name' | 'createdAt' | 'updatedAt'>;

interface ProjectCardProps {
	project: ProjectCardData;
	onEditClick?: (project: ProjectCardData) => void;
	onDeleteClick?: (project: ProjectCardData) => void;
}

function ClockIcon({ date }: { date: Date }) {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const hourAngle = (hours % 12) * 30 + minutes * 0.5;
	const minuteAngle = minutes * 6;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5 text-indigo-500 flex-shrink-0"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<line
				x1="12"
				y1="12"
				x2={12 + 3.5 * Math.sin((Math.PI / 180) * hourAngle)}
				y2={12 - 3.5 * Math.cos((Math.PI / 180) * hourAngle)}
			/>
			<line
				x1="12"
				y1="12"
				x2={12 + 5.5 * Math.sin((Math.PI / 180) * minuteAngle)}
				y2={12 - 5.5 * Math.cos((Math.PI / 180) * minuteAngle)}
			/>
		</svg>
	);
}

export function ProjectCard({ project, onEditClick, onDeleteClick }: ProjectCardProps) {
	const { name, createdAt, updatedAt } = project;

	const [hoveredUpdate, setHoveredUpdate] = useState(false);
	const [hoveredDelete, setHoveredDelete] = useState(false);

	const createdDate = new Date(createdAt);
	const updatedDate = new Date(updatedAt);

	const formattedCreatedDate = createdDate.toLocaleDateString(undefined, {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
	const formattedCreatedTime = createdDate.toLocaleTimeString(undefined, {
		hour: '2-digit',
		minute: '2-digit',
	});

	const formattedUpdatedDate = updatedDate.toLocaleDateString(undefined, {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
	const formattedUpdatedTime = updatedDate.toLocaleTimeString(undefined, {
		hour: '2-digit',
		minute: '2-digit',
	});

	return (
		<motion.div
			data-testid="project-card"
			whileHover={{ y: -4 }}
			className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200
					   shadow-sm hover:shadow-md rounded-2xl p-5 flex flex-col justify-between
					   transition-all duration-200 w-full max-w-[280px]"
		>
			{/* ───────── HEADER ───────── */}
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-3 truncate">
					{name}
				</h3>
				<div className="w-10 border-t border-indigo-500 mb-4" />

				<div className="space-y-2 text-xs text-gray-500">
					<div className="flex items-center gap-2">
						<ClockIcon date={createdDate} />
						<p>
							<span className="font-medium text-gray-800">Created:</span>{' '}
							{formattedCreatedDate}{' '}
							<span className="text-gray-400">
								• {formattedCreatedTime}
							</span>
						</p>
					</div>

					<div className="flex items-center gap-2">
						<ClockIcon date={updatedDate} />
						<p>
							<span className="font-medium text-gray-800">Updated:</span>{' '}
							{formattedUpdatedDate}{' '}
							<span className="text-gray-400">
								• {formattedUpdatedTime}
							</span>
						</p>
					</div>
				</div>
			</div>

			{/* ───────── BUTTONS ───────── */}
			<div className="flex justify-between items-center mt-5 relative">
				{/* Update */}
				<motion.button
					aria-label="update project"
					data-testid={`update-button-${project.id}`}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.96 }}
					onMouseEnter={() => setHoveredUpdate(true)}
					onMouseLeave={() => setHoveredUpdate(false)}
					onClick={() => onEditClick?.(project)}
					className="relative group flex items-center gap-1 px-3 py-1.5
							   text-sm text-indigo-600 font-medium rounded-md overflow-hidden
							   cursor-pointer transition-all duration-300 hover:text-indigo-700
							   focus:outline-none"
				>
					<span className="relative z-10 flex items-center gap-1">
						Update
						<AnimatePresence>
							{hoveredUpdate && (
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
							)}
						</AnimatePresence>
					</span>

					<span
						className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-indigo-500/20
									opacity-0 group-hover:opacity-60 blur-md transition-opacity rounded-md"
					/>
				</motion.button>

				{/* Delete */}
				<motion.button
					aria-label="delete project"
					data-testid={`delete-button-${project.id}`}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.96 }}
					onMouseEnter={() => setHoveredDelete(true)}
					onMouseLeave={() => setHoveredDelete(false)}
					onClick={() => onDeleteClick?.(project)}
					className="relative group flex items-center gap-1 px-3 py-1.5
							   text-sm text-rose-600 font-medium rounded-md overflow-hidden
							   cursor-pointer transition-all duration-300 hover:text-rose-700
							   focus:outline-none"
				>
					<span className="relative z-10 flex items-center gap-1">
						Delete
						<AnimatePresence>
							{hoveredDelete && (
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
							)}
						</AnimatePresence>
					</span>

					<span
						className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-rose-500/20
									opacity-0 group-hover:opacity-60 blur-md transition-opacity rounded-md"
					/>
				</motion.button>
			</div>
		</motion.div>
	);
}
