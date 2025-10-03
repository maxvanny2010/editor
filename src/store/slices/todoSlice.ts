import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
	id: number;
	title: string;
}

export interface TodosState {
	items: Todo[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: TodosState = {
	items: [],
	status: 'idle', // вместо boolean
	error: null,
};

export const fetchTodos = createAsyncThunk<Todo[]>('todos/fetch', async () => {
	const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
	if (!res.ok) throw new Error('Failed to fetch todos');
	return (await res.json()) as Todo[];
});

const todosSlice = createSlice({
	name: 'todos',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTodos.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
				state.status = 'succeeded';
				state.items = action.payload;
			})
			.addCase(fetchTodos.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message ?? 'Unknown error';
			});
	},
});

export default todosSlice.reducer;
