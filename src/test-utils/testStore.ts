import {
	combineReducers,
	configureStore,
	type ReducersMapObject,
} from '@reduxjs/toolkit';
import { projectsReducer } from '@/entities/project/model/slice';
import { editorReducer } from '@/entities/editor/model/slice';
import { brushReducer } from '@/entities/brush/model/slice';
import { lineReducer } from '@/entities/line/model/slice';
import { shapeReducer } from '@/entities/shape/model';

type ProjectsState = ReturnType<typeof projectsReducer>;
type EditorState = ReturnType<typeof editorReducer>;
type BrushState = ReturnType<typeof brushReducer>;
type LineState = ReturnType<typeof lineReducer>;
type ShapeState = ReturnType<typeof shapeReducer>;

interface TestBaseState {
	projects: ProjectsState;
	editor: EditorState;
	brush: BrushState;
	line: LineState;
	shape: ShapeState;
}

/**
 * Creates a fresh, isolated Redux store for testing purposes.
 */
export const makeTestStore = <
	TExtraReducers extends ReducersMapObject = Record<string, never>,
>(
	preloadedState?: Partial<TestBaseState>,
	extraReducers?: TExtraReducers,
) => {
	const rootReducer = combineReducers({
		projects: projectsReducer,
		editor: editorReducer,
		brush: brushReducer,
		line: lineReducer,
		shape: shapeReducer,
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
