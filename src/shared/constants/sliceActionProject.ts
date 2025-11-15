/**
 * Redux slice action type helpers.
 * Used when defining simple actions (not async thunks).
 */
export const PROJECT_SLICE_ACTIONS = {
	PROJECTS_CLEAR_ALL: 'projects/clearAll',
	PROJECT_UPSET: 'projects/upsertProject',
	PROJECT_SET_ACTIVE_ID: 'projects/setActiveProjectId',
	PROJECT_UPLOAD_ACTIVE_PROJECT: 'projects/loadActiveProject',
} as const;
