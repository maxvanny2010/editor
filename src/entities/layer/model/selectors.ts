import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import { layersAdapter } from './slice';

/**
 * Base adapter selectors for layers entity.
 */
const baseSelectors = layersAdapter.getSelectors((s: RootState) => s.layers);

/**
 * Returns all layers (unfiltered).
 * Useful for debugging or global counts.
 */
const selectAllLayers = baseSelectors.selectAll;

/**
 * Memoized selector factory — returns a stable array of layers
 * belonging to the given projectId. Prevents unnecessary re-renders.
 *
 * Usage:
 *   const selectByProject = useMemo(makeSelectByProject, []);
 *   const layers = useAppSelector((s) => selectByProject(s, projectId));
 */
export const makeSelectByProject = () =>
	createSelector(
		[selectAllLayers, (_: RootState, projectId: string) => projectId],
		(layers, projectId) => layers.filter((l) => l.projectId === projectId),
	);

/**
 * Memoized global selectors for layers slice.
 */
export const layersSelectors = {
	...baseSelectors,

	selectLoading: (s: RootState) => s.layers.loading,
	selectError: (s: RootState) => s.layers.error,

	/**
	 * Returns the currently active layer or null if none is selected.
	 * Stable reference — won't trigger re-render if unchanged.
	 */
	selectActiveLayer: createSelector(
		[(s: RootState) => s.layers.activeId, (s: RootState) => s.layers.entities],
		(activeId, entities) => (activeId ? (entities[activeId] ?? null) : null),
	),

	/**
	 * Simple non-memoized version (fallback) — not recommended for large projects.
	 */
	selectByProject: (s: RootState, projectId: string) =>
		baseSelectors.selectAll(s).filter((l) => l.projectId === projectId),
};
