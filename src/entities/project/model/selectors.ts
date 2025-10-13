import type { RootState } from '@/store';
import { projectsAdapter } from '@/entities/project/model';

export const projectsSelectors = {
	...projectsAdapter.getSelectors((state: RootState) => state.projects),
	selectLoading: (state: RootState) => state.projects.loading,
	selectError: (state: RootState) => state.projects.error,
};
