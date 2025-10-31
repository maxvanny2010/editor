import type { RootState } from '@/store';
import { layersAdapter } from '@/entities/layer/model/slice';

export const layersSelectors = {
	...layersAdapter.getSelectors((s: RootState) => s.layers),

	selectLoading: (s: RootState) => s.layers.loading,
	selectError: (s: RootState) => s.layers.error,

	selectActiveLayer: (s: RootState) =>
		s.layers.entities[s.layers.activeId ?? ''] ?? null,

	selectByProject: (s: RootState, projectId: string) =>
		layersAdapter
			.getSelectors((state: RootState) => state.layers)
			.selectAll(s)
			.filter((l) => l.projectId === projectId),
};
