/**
 * Redux slice action type helpers.
 * Used when defining simple actions (not async thunks).
 */
export const SLICE_ACTIONS = {
	SET_ACTIVE_ID: '/setActiveId',
	SET_CURRENT_PROJECT: '/setCurrentProject',
	CLEAR_ERROR: '/clearError',
	RESET: '/reset',
} as const;
