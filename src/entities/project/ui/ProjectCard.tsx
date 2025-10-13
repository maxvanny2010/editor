import type { Project } from '@/shared/types';
import React from 'react';

export const ProjectCard = ({
	project,
	...props
}: { project: Project } & React.HTMLAttributes<HTMLDivElement>) => (
	<div
		data-testid="project-card"
		className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition"
		{...props}
	>
		<h3 className="text-lg font-semibold mb-2">{project.name}</h3>
		<p className="text-sm text-gray-500">
			Updated: {new Date(project.updatedAt).toLocaleString()}
		</p>
	</div>
);
