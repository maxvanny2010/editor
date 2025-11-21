/**
 * Redux slice action type helpers.
 * Used when defining simple actions (not async thunks).
 */
export const LAYER_SLICE_ACTIONS = {
	SET_ACTIVE_ID: 'layers/setActiveId',
	SET_CURRENT_PROJECT: 'layers/setCurrentProject',
	CLEAR_ERROR: 'layers/clearError',
	RESET: 'layers/reset',
	UPDATE_SNAPSHOT: 'layers/updateSnapshot',
	REPLACE_FROM_SNAPSHOT: 'layers/replaceSnapshot',
	LAYER_INIT_BASE: 'layers/ensureInitialLayer',
} as const;
