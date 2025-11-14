/**
 * Redux slice action type helpers.
 * Used when defining simple actions (not async thunks).
 */
export const HISTORY_SLICE_ACTIONS = {
	LOAD_HISTORY_FROM_DB: 'history/loadFromDB',
	APPLY_SNAPSHOT: 'history/applyCurrentSnapshot',
} as const;
