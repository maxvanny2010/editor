export const LAYER = {
	NAME: (nextIndex: number) => `Layer ${nextIndex}`,
	CREATED: (layerName: string) => `Created layer: ${layerName}`,
	DELETED: (layerName: string) => `Deleted layer: ${layerName}`,
	UPDATED: (layerName: string) => `Updated layer: ${layerName}`,
	OPACITY_ADJUSTED: (layerName: string) => `Adjusted opacity (${layerName})`,
	RENAMED: (layerName: string) => `Renamed layer → “${layerName}”`,
	REORDERED: 'Reordered:',
	REORDERED_LAYERS: 'Reordered layers',
	RESTORED_LAYER: 'Restored Layer',
	REORDER_LABEL_BELOW: (layerName: string, belowName: string) =>
		`“${layerName}” below “${belowName}”`,
	REORDER_LABEL_ABOVE: (layerName: string, aboveName: string) =>
		`“${layerName}” above “${aboveName}”`,
	REORDER_LABEL_SWAP: (belowName: string, aboveName: string) =>
		`Reordered: “${belowName}” ↔ “${aboveName}”`,
	CREATE_BASE_LAYER: (baseLayerName: string) => `Created base layer "${baseLayerName}"`,

	// Generic system messages
	ERROR_ACTION: 'Error during a layer action',
	ERROR_VALIDATION: 'Validation failed',
	NAME_EMPTY: 'Layer name is required',
	NOT_FOUND_AFTER_UPDATE: 'Layer not found after update',
	ERROR_FETCH_BY_PROJECT: 'Failed to load layers for the selected project.',
	TABLE_NAME: 'layers',
	NEW_LAYER: 'Layer',
} as const;

export const LAYER_DEFAULTS = {
	INITIAL_NAME: 'Layer 1',
	UNTITLED_PROJECT: 'Untitled',
} as const;

export const LAYER_ERROR_MESSAGES = {
	LAYER_NOT_FOUND: (id: string) => `Layer with id ${id} not found after update`,
} as const;
