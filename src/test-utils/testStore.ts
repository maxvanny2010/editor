import { configureStore } from '@reduxjs/toolkit';
import { projectsReducer } from '@/entities/project/model/slice';

/**
 * Creates a fresh, isolated Redux store for testing purposes.
 */
export const makeTestStore = () =>
	configureStore({
		reducer: { projects: projectsReducer },
		// Disable middleware and devtools for clean unit testing
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
		devTools: false,
	});

export type TestStore = ReturnType<typeof makeTestStore>;
export type TestRootState = ReturnType<TestStore['getState']>;
