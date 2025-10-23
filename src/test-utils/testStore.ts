import {
	combineReducers,
	configureStore,
	type ReducersMapObject,
} from '@reduxjs/toolkit';
import { projectsReducer } from '@/entities/project/model/slice';

type ProjectsState = ReturnType<typeof projectsReducer>;

interface BaseTestState {
	projects: ProjectsState;
}

/**
 * Creates a fresh, isolated Redux store for testing purposes.
 */
export const makeTestStore = <
	TExtraReducers extends ReducersMapObject = Record<string, never>,
>(
	preloadedState?: Partial<BaseTestState>,
	extraReducers?: TExtraReducers,
) => {
	const rootReducer = combineReducers({
		projects: projectsReducer,
		...extraReducers,
	});

	return configureStore({
		reducer: rootReducer,
		preloadedState: preloadedState as unknown as ReturnType<typeof rootReducer>,
		devTools: false,
	});
};

export type TestStore = ReturnType<typeof makeTestStore>;
export type TestRootState = ReturnType<TestStore['getState']>;
