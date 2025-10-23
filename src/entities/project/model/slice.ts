import { createAsyncEntitySlice } from '@/shared/lib/store';
import { projectService } from './project.service';
import type { Project } from '@/shared/types';
import { createAction, type UnknownAction } from '@reduxjs/toolkit';

export const {
	reducer: baseReducer,
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

const baseInitialState = baseReducer(undefined, { type: '@@INIT' });

export type BaseProjectsState = typeof baseInitialState;

export type ProjectsState = BaseProjectsState & {
	activeId: string | null;
};

export const initialState: ProjectsState = {
	...baseInitialState,
	activeId: null,
};

export const setActiveProjectId = createAction<string | null>(
	'projects/setActiveProjectId',
);

export function projectsReducer(
	state: ProjectsState = initialState,
	action: UnknownAction,
): ProjectsState {
	if (setActiveProjectId.match(action)) {
		return { ...state, activeId: action.payload };
	}

	const nextBase = baseReducer(state, action);
	return { ...nextBase, activeId: state.activeId };
}
