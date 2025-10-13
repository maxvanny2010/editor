import type { Project } from '@/shared/types';
import { nanoid } from 'nanoid';
import { projectRepository } from '../api';
import { PROJECT_MESSAGES } from '@/shared/constants';

export const projectService = {
	async getProjects(): Promise<Project[]> {
		return projectRepository.getAll();
	},

	async createProject(data: { name: string }): Promise<Project> {
		const name = data.name.trim();
		if (!name) throw new Error(PROJECT_MESSAGES.EMPTY_NAME);

		const exists = await projectRepository.findByName(name);
		if (exists) throw new Error(PROJECT_MESSAGES.DUPLICATE_NAME);

		const newProject: Project = {
			id: nanoid(),
			name,
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

	async deleteProject(id: string): Promise<void> {
		await projectRepository.remove(id);
	},
};
