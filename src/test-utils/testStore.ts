import { configureStore } from '@reduxjs/toolkit';
import { projectsReducer } from '@/entities/project/model/slice';

export const makeTestStore = () =>
	configureStore({
		reducer: { projects: projectsReducer },
	});

export type TestStore = ReturnType<typeof makeTestStore>;
export type TestRootState = ReturnType<TestStore['getState']>;
