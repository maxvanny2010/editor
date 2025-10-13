import { configureStore } from '@reduxjs/toolkit';
import { projectsReducer } from '@/entities/project/model/slice';

/**
 * Creates a fresh, isolated Redux store for testing purposes.
 */
type ProjectsState = ReturnType<typeof projectsReducer>;

export const makeTestStore = (preloadedState?: { projects?: ProjectsState }) =>
	configureStore({
		reducer: { projects: projectsReducer },
		preloadedState: preloadedState as { projects: ProjectsState },
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
		devTools: false,
	});

export type TestStore = ReturnType<typeof makeTestStore>;
export type TestRootState = ReturnType<TestStore['getState']>;
