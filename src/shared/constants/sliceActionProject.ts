/**
 * Redux slice action type helpers.
 * Used when defining simple actions (not async thunks).
 */
export const PROJECT_SLICE_ACTIONS = {
	CLEAR_ALL_PROJECTS: 'projects/clearAll',
	SET_ACTIVE_PROJECT_ID: 'projects/setActiveProjectId',
} as const;
