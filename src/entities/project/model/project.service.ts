// src/entities/project/model/project.service.ts
import type { Project } from '@/shared/types';
import { nanoid } from 'nanoid';
import { projectRepository } from '../api/project.repository';

export const projectService = {
	async getProjects(): Promise<Project[]> {
		return projectRepository.getAll();
	},

	async createProject(data: { name: string }): Promise<Project> {
		const name = data.name.trim();
		if (!name) throw new Error('Название проекта не может быть пустым.');
		const exists = await projectRepository.findByName(name);
		if (exists) throw new Error('Проект с таким названием уже существует.');

		const newProject: Project = {
			id: nanoid(),
			name,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		await projectRepository.add(newProject);
		return newProject;
	},

	// ВАЖНО: возвращаем полный Project после обновления
	async updateProject(args: {
		id: string;
		changes: Partial<Project>;
	}): Promise<Project> {
		const { id, changes } = args;
		await projectRepository.update(id, { ...changes, updatedAt: Date.now() });
		const updated = await projectRepository.getById(id);
		if (!updated) throw new Error('Проект не найден после обновления');
		return updated;
	},

	async deleteProject(id: string): Promise<void> {
		await projectRepository.remove(id);
	},
};
