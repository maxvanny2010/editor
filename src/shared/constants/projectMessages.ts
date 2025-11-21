export const PROJECT_MESSAGES = {
	ERROR_ACTION: 'Error during an action',
	ERROR_VALIDATION: 'Validation failed',
	ERROR_PROJECT_NOT_FOUND: (id: string) =>
		`Project "${id}" not found in local database`,
	NAME_EMPTY: 'Project name is required',
	NAME_REQUEST: 'Project name must be 25 characters or less',
	NAME_DUPLICATE: 'A project with this name already exists',
	NOT_FOUND_AFTER_UPDATE: 'Project not found after update',
	UNEXPECTED_SERVER_ERROR: 'Unexpected server error',
	CANVAS_REQUIRED_WIDTH_MIN: 'Canvas width must be at least 100px',
	CANVAS_REQUIRED_WIDTH_MAX: 'Canvas width cannot exceed 4000px',
	CANVAS_REQUIRED_HEIGHT_MIN: 'Canvas height must be at least 100px',
	CANVAS_REQUIRED_HEIGHT_MAX: 'Canvas height cannot exceed 4000px',
} as const;
