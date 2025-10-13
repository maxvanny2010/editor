import { createAsyncEntitySlice } from '@/shared/lib/store/createAsyncEntitySlice';
import { projectService } from './project.service';
import type { Project } from '@/shared/types';

export const {
	reducer: projectsReducer,
	actions: projectsActions,
	adapter: projectsAdapter,
	thunks: {
		fetchAllThunk: fetchProjects,
		createOneThunk: createProject,
		updateOneThunk: updateProject,
		deleteOneThunk: deleteProject,
	},
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
