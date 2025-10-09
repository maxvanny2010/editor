import { configureStore } from '@reduxjs/toolkit';
import { projectsReducer } from '@/entities/project/model/slice.ts';
import logger from 'redux-logger';

export const store = configureStore({
	reducer: {
		projects: projectsReducer,
	},
	middleware: (getDefaultMiddleware) => {
		const middlewares = getDefaultMiddleware();

		if (import.meta.env.MODE === 'development') {
			middlewares.push(logger);
		}

		return middlewares;
	},
	devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
