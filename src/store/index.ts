import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice.ts';
import todosReducer, { fetchTodos } from './slices/todoSlice.ts';
import logger from 'redux-logger';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		todos: todosReducer,
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

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { fetchTodos };
