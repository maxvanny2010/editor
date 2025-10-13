export const PROJECT_STATE = {
	IDLE: 'idle',
	PENDING: 'pending',
	SUCCEEDED: 'succeeded',
	FAILED: 'failed',
} as const;

export type ProjectState = (typeof PROJECT_STATE)[keyof typeof PROJECT_STATE];
