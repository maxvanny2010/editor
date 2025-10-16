import type { Project } from '@/shared/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export type ProjectCardData = Pick<Project, 'id' | 'name' | 'createdAt' | 'updatedAt'>;

interface ProjectCardProps {
	project: ProjectCardData;
	onEditClick?: (project: ProjectCardData) => void;
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

export function ProjectCard({ project, onEditClick }: ProjectCardProps) {
	const { name, createdAt, updatedAt } = project;
	const [hovered, setHovered] = useState(false);

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
			className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-md rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 w-full max-w-[280px]"
		>
			{/* ───────── HEADER ───────── */}
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-3 truncate">
					{name}
				</h3>
				<div className="w-10 border-t border-indigo-500 mb-4"></div>

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

			{/* ───────── BUTTON EDIT ───────── */}
			<div className="flex justify-end mt-5 relative">
				<button
					aria-label="update project"
					data-testid={`update-button-${project.id}`}
					onClick={() => onEditClick?.(project)}
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
					className="group flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 font-medium hover:text-indigo-700 transition cursor-pointer"
				>
					Update
					<AnimatePresence>
						{hovered && (
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
								className="w-4 h-4 text-indigo-500"
							>
								<path d="M12 20h9" />
								<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
							</motion.svg>
						)}
					</AnimatePresence>
				</button>
			</div>
		</motion.div>
	);
}
