// src/entities/project/model/slice.ts

import { createAsyncEntitySlice } from '@/shared/lib/store/createAsyncEntitySlice';
import { projectService } from './project.service';
import type { RootState } from '@/app/store';
import type { Project } from '@/shared/types';

export const {
	reducer: projectsReducer,
	actions: projectsActions,
	thunks: {
		fetchAllThunk: fetchProjects,
		createOneThunk: createProject,
		updateOneThunk: updateProject,
		deleteOneThunk: deleteProject,
	},
	makeSelectors,
} = createAsyncEntitySlice<
	Project,
	{ name: string },
	{ id: string; changes: Partial<Project> }
>({
	name: 'projects',
	fetchAll: projectService.getProjects,
	createOne: projectService.createProject,
	updateOne: projectService.updateProject,
	deleteOne: projectService.deleteProject,
	sortComparer: (a, b) => b.updatedAt - a.updatedAt,
});

// типобезопасные селекторы, привязанные к корню стора
export const projectsSelectors = makeSelectors<RootState>((s) => s.projects);
