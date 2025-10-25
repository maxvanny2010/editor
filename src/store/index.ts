import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import { projectsReducer } from '@/entities/project/model/slice';
import { editorReducer } from '@/entities/editor/model/slice';
import { brushReducer } from '@/entities/brush/model/slice';
import { lineReducer } from '@/entities/line/model/slice';

export const store = configureStore({
	reducer: {
		projects: projectsReducer,
		editor: editorReducer,
		brush: brushReducer,
		line: lineReducer,
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
