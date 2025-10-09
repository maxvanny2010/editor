import { createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from './project.service';

export const fetchProjects = createAsyncThunk(
	'projects/fetch',
	projectService.getProjects,
);

export const createProjectThunk = createAsyncThunk(
	'projects/create',
	async (data: { name: string }) => await projectService.createProject(data),
);

export const deleteProjectThunk = createAsyncThunk(
	'projects/delete',
	async (id: string) => {
		await projectService.deleteProject(id);
		return id;
	},
);
