import { createAction, createAsyncThunk, type UnknownAction } from '@reduxjs/toolkit';
import { createAsyncEntitySlice } from '@/shared/lib/store';
import { projectService } from '@/entities/project/model/project.service';
import type { Project } from '@/shared/types';
import {
	ENTITY_LOADING_STATUSES,
	NAMES,
	PROJECT_SLICE_ACTIONS,
} from '@/shared/constants';

// ───────────────────────────────────────────────
// Base async slice
// ───────────────────────────────────────────────
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
	name: `${NAMES.PROJECTS}`,
	fetchAll: projectService.getProjects,
	createOne: projectService.createProject,
	updateOne: projectService.updateProject,

	deleteOne: async (id: string): Promise<string> => {
		await projectService.deleteWithRelations(id);
		return id;
	},

	sortComparer: (a, b) => b.updatedAt - a.updatedAt,
});

// ───────────────────────────────────────────────
// Clear all
// ───────────────────────────────────────────────
export const clearAllProjects = createAsyncThunk(
	`${PROJECT_SLICE_ACTIONS.CLEAR_ALL_PROJECTS}`,
	async (_, { dispatch }) => {
		await projectService.clearAll();
		await dispatch(fetchProjects());
	},
);

// ───────────────────────────────────────────────
// State
// ───────────────────────────────────────────────
type BaseProjectsState = ReturnType<typeof baseReducer>;

export interface ProjectsState extends BaseProjectsState {
	activeId: string | null;
}

export const initialState: ProjectsState = {
	...(baseReducer(undefined, { type: '@@INIT' }) as BaseProjectsState),
	activeId: null,
};

// ───────────────────────────────────────────────
// Actions
// ───────────────────────────────────────────────
export const setActiveProjectId = createAction<string | null>(
	`${PROJECT_SLICE_ACTIONS.SET_ACTIVE_PROJECT_ID}`,
);

// ───────────────────────────────────────────────
// Reducer
// ───────────────────────────────────────────────
export function projectsReducer(
	state: ProjectsState = initialState,
	action: UnknownAction,
): ProjectsState {
	if (setActiveProjectId.match(action)) {
		//	void projectRepository.saveActiveId(action.payload);
		return { ...state, activeId: action.payload };
	}

	let next = baseReducer(state, action) as ProjectsState;

	if (deleteProject.fulfilled.match(action)) {
		const deletedId = action.payload as string;
		if (next.activeId === deletedId) next = { ...next, activeId: null };
	}

	if (clearAllProjects.pending.match(action)) {
		return { ...next, loading: ENTITY_LOADING_STATUSES.PENDING };
	}
	if (clearAllProjects.fulfilled.match(action)) {
		return { ...next, activeId: null, loading: ENTITY_LOADING_STATUSES.SUCCEEDED };
	}
	if (clearAllProjects.rejected.match(action)) {
		return { ...next, loading: ENTITY_LOADING_STATUSES.FAILED };
	}

	return next;
}
