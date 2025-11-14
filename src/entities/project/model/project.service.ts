import { nanoid } from 'nanoid';
import { db } from '@/shared/lib/db';
import type { Project } from '@/shared/types';
import { layerRepository } from '@/entities/layer/api';
import { historyRepository } from '@/entities/history/api';
import { projectRepository } from '@/entities/project/api';
import { PROJECT_MESSAGES, REPOSITORY_FIELDS } from '@/shared/constants';

export const projectService = {
	async getProjects(): Promise<Project[]> {
		return projectRepository.getAll();
	},

	async createProject(data: {
		name: string;
		width?: number;
		height?: number;
	}): Promise<Project> {
		const name = data.name.trim();
		if (!name) throw new Error(PROJECT_MESSAGES.NAME_EMPTY);

		const exists = await projectRepository.findByName(name);
		if (exists) throw new Error(PROJECT_MESSAGES.NAME_DUPLICATE);

		const newProject: Project = {
			id: nanoid(),
			name,
			width: data.width ?? 800,
			height: data.height ?? 600,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};

		await projectRepository.add(newProject);
		return newProject;
	},

	async updateProject(args: {
		id: string;
		changes: Partial<Project>;
	}): Promise<Project> {
		const { id, changes } = args;
		await projectRepository.update(id, { ...changes, updatedAt: Date.now() });
		const updated = await projectRepository.getById(id);
		if (!updated) throw new Error(PROJECT_MESSAGES.NOT_FOUND_AFTER_UPDATE);
		return updated;
	},

	/**
	 * Complete project deletion with all dependencies.
	 */
	async deleteWithRelations(projectId: string): Promise<string> {
		await db.transaction(
			'rw',
			db.projects,
			db.layers,
			db.viewStates,
			db.history,
			async () => {
				await projectRepository.remove(projectId);
				await layerRepository.removeByProject(projectId);
				await db.viewStates
					.where(`${REPOSITORY_FIELDS.PROJECT_ID}`)
					.equals(projectId)
					.delete();
				await historyRepository.clearByProject(projectId);
			},
		);
		return projectId;
	},
	async clearAll(): Promise<void> {
		const projects = await projectRepository.getAll();
		for (const project of projects) {
			await projectService.deleteWithRelations(project.id);
		}
	},
};
