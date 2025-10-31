/**
 * Async loading statuses for entity slices.
 * Used to indicate the current state of CRUD requests.
 */
export const ENTITY_LOADING_STATUSES = {
	IDLE: 'idle',
	PENDING: 'pending',
	SUCCEEDED: 'succeeded',
	FAILED: 'failed',
} as const;

/** Type helper for allowed loading status strings. */
export type EntityLoadingStatus =
	(typeof ENTITY_LOADING_STATUSES)[keyof typeof ENTITY_LOADING_STATUSES];
