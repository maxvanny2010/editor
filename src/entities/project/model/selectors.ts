import type { RootState } from '@/store';
import { projectsAdapter } from '@/entities/project/model/slice.ts';

export const projectsSelectors = {
	...projectsAdapter.getSelectors((s: RootState) => s.projects),

	selectLoading: (s: RootState) => s.projects.loading,
	selectError: (s: RootState) => s.projects.error,

	selectActiveProject: (s: RootState) =>
		s.projects.entities[s.projects.activeId ?? ''] ?? null,
};
