import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
	isAnyOf,
	type PayloadAction,
} from '@reduxjs/toolkit';
import { PROJECT_MESSAGES } from '@/shared/constants/projectMessages.ts';

/**
 * a fabric of CRUD-slice.
 * T — entity (require id: string, name? for selectByName)
 * C — a type of argument for createOne
 * U — a type of argument for updateOne
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

	//  T has id
	const adapter = createEntityAdapter<T>({ sortComparer });

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
					state.loading = 'succeeded';
				})
				.addCase(updateOneThunk.fulfilled, (state, action: PayloadAction<T>) => {
					adapter.upsertOne(state, action.payload);
					state.loading = 'succeeded';
				})
				.addCase(
					deleteOneThunk.fulfilled,
					(state, action: PayloadAction<string>) => {
						adapter.removeOne(state, action.payload);
						state.loading = 'succeeded';
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
							action.error.message ?? PROJECT_MESSAGES.ERROR_ACTION;
					},
				);
		},
	});

	/** selectors with a RootState */
	function makeSelectors<RootState>(selectSlice: (state: RootState) => SliceState) {
		const base = adapter.getSelectors(selectSlice);
		return {
			...base,
			/** if name is empty — takes empty string */
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
