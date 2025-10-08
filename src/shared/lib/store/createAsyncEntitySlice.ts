// src/shared/lib/store/createAsyncEntitySlice.ts
import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
	isAnyOf,
	type PayloadAction,
} from '@reduxjs/toolkit';

/**
 * Универсальная фабрика CRUD-слайса.
 * T — сущность (обязателен id: string, name? для selectByName)
 * C — тип аргумента для createOne (ИНФЕРИТСЯ)
 * U — тип аргумента для updateOne (ИНФЕРИТСЯ)
 */
export function createAsyncEntitySlice<
	T extends { id: string; name?: string },
	C,
	U,
>(options: {
	name: string;
	fetchAll: () => Promise<T[]>;
	createOne: (data: C) => Promise<T>;
	updateOne: (data: U) => Promise<T>;
	deleteOne: (id: string) => Promise<void>;
	sortComparer?: (a: T, b: T) => number;
}) {
	const { name, fetchAll, createOne, updateOne, deleteOne, sortComparer } = options;

	// У T есть свойство id, поэтому selectId не указываем (RTK сам его возьмёт)
	const adapter = createEntityAdapter<T>({ sortComparer });

	// Точно типизированные thunks
	const fetchAllThunk = createAsyncThunk<T[]>(
		`${name}/fetchAll`,
		async () => await fetchAll(),
	);

	const createOneThunk = createAsyncThunk<T, C>(
		`${name}/createOne`,
		async (arg) => await createOne(arg),
	);

	const updateOneThunk = createAsyncThunk<T, U>(
		`${name}/updateOne`,
		async (arg) => await updateOne(arg),
	);

	const deleteOneThunk = createAsyncThunk<string, string>(
		`${name}/deleteOne`,
		async (id) => {
			await deleteOne(id);
			return id;
		},
	);

	const initialState = adapter.getInitialState({
		loading: 'idle' as 'idle' | 'pending' | 'succeeded' | 'failed',
		error: null as string | null,
	});
	type SliceState = typeof initialState;

	const slice = createSlice({
		name,
		initialState,
		reducers: {
			clearError(state) {
				state.error = null;
			},
		},
		extraReducers: (builder) => {
			builder
				.addCase(fetchAllThunk.fulfilled, (state, action: PayloadAction<T[]>) => {
					adapter.setAll(state, action.payload);
					state.loading = 'succeeded';
				})
				.addCase(createOneThunk.fulfilled, (state, action: PayloadAction<T>) => {
					adapter.addOne(state, action.payload);
				})
				.addCase(updateOneThunk.fulfilled, (state, action: PayloadAction<T>) => {
					adapter.upsertOne(state, action.payload);
				})
				.addCase(
					deleteOneThunk.fulfilled,
					(state, action: PayloadAction<string>) => {
						adapter.removeOne(state, action.payload);
					},
				)
				.addMatcher(
					isAnyOf(
						fetchAllThunk.pending,
						createOneThunk.pending,
						updateOneThunk.pending,
						deleteOneThunk.pending,
					),
					(state) => {
						state.loading = 'pending';
					},
				)
				.addMatcher(
					isAnyOf(
						fetchAllThunk.rejected,
						createOneThunk.rejected,
						updateOneThunk.rejected,
						deleteOneThunk.rejected,
					),
					(state, action) => {
						state.loading = 'failed';
						state.error =
							action.error.message ?? 'Ошибка при выполнении операции';
					},
				);
		},
	});

	/** Типобезопасные селекторы, привязанные к RootState */
	function makeSelectors<RootState>(selectSlice: (state: RootState) => SliceState) {
		const base = adapter.getSelectors(selectSlice);
		return {
			...base,
			/** Поиск по имени (если name нет — берём пустую строку) */
			selectByName(state: RootState, query: string): T[] {
				const q = query.toLowerCase();
				return base
					.selectAll(state)
					.filter((item) => (item.name ?? '').toLowerCase().includes(q));
			},
		};
	}

	return {
		reducer: slice.reducer,
		actions: slice.actions,
		adapter,
		thunks: { fetchAllThunk, createOneThunk, updateOneThunk, deleteOneThunk },
		makeSelectors,
	};
}
