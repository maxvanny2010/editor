import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import { projectsReducer } from '@/entities/project/model/slice';
import { layersReducer } from '@/entities/layer/model/slice';
import { editorReducer } from '@/entities/editor/model/slice';
import { brushReducer } from '@/entities/brush/model/slice';
import { lineReducer } from '@/entities/line/model/slice';
import { shapeReducer } from '@/entities/shape/model/slice';
import { eraserReducer } from '@/entities/eraser/model/slice';
import { historyReducer } from '@/entities/history/model/slice';
import { setupLayerListeners } from '@/entities/layer/model';
import { setupProjectListeners } from '@/entities/project/model';
import { listener, setupHistoryListeners } from '@/entities/history/model/listener';

export const store = configureStore({
	reducer: {
		projects: projectsReducer,
		layers: layersReducer,
		editor: editorReducer,
		brush: brushReducer,
		line: lineReducer,
		shape: shapeReducer,
		eraser: eraserReducer,
		history: historyReducer,
	},
	middleware: (getDefaultMiddleware) => {
		const middlewares = getDefaultMiddleware().prepend(listener.middleware);
		if (import.meta.env.MODE === 'development') middlewares.push(logger);
		return middlewares;
	},
	devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Get a typed startListening function for the listener middleware
const startAppListening = listener.startListening.withTypes<RootState, AppDispatch>();

// Register listeners after store creation
setupHistoryListeners(startAppListening);
setupProjectListeners(startAppListening);
setupLayerListeners(startAppListening);
