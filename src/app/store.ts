// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { projectsReducer } from '@/entities/project/model/slice.ts';

export const store = configureStore({
	reducer: {
		projects: projectsReducer,
	},
	devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
