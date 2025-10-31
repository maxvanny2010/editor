import {
	type AsyncThunk,
	createAsyncThunk,
	createEntityAdapter,
	createSelector,
	createSlice,
	type Draft,
} from '@reduxjs/toolkit';
import {
	CRUD_ACTION_SUFFIXES,
	ENTITY_LOADING_STATUSES,
	type EntityLoadingStatus,
	PROJECT_MESSAGES,
} from '@/shared/constants';
import { createThunkWithErrorHandling } from '@/shared/lib/store';

/**
 * Generic CRUD slice factory with strict type safety.
 *
 * @template T - Entity type (must include `id: string`)
 * @template C - Argument type for createOne (defaults to Partial<T>)
 * @template U - Argument type for updateOne (Partial<T> & { id: string })
 * @template P - Argument type for fetchByParam (e.g., projectId)
 */
export function createAsyncEntitySlice<
	T extends { id: string; name?: string },
	C = Partial<T>,
	U = Partial<T> & { id: string },
	P = void,
>(options: {
	name: string;
	fetchAll?: () => Promise<T[]>;
	fetchByParam?: (param: P) => Promise<T[]>;
	createOne: (data: C) => Promise<T>;
	updateOne: (data: U) => Promise<T>;
	deleteOne: (id: string) => Promise<void>;
	sortComparer?: (a: T, b: T) => number;
}) {
	const {
		name,
		fetchAll,
		fetchByParam,
		createOne,
		updateOne,
		deleteOne,
		sortComparer,
	} = options;

	const adapter = createEntityAdapter<T>({ sortComparer });

	// Helper: creates a noop thunk that always resolves with empty array
	const noopThunk = createAsyncThunk(`${name}/noop`, async () => [] as T[]);

	// ──────────────────────────────
	// Async Thunks
	// ──────────────────────────────
	const fetchAllThunk = fetchAll
		? createThunkWithErrorHandling<T[], void>(
				`${name}${CRUD_ACTION_SUFFIXES.FETCH_ALL}`,
				fetchAll,
			)
		: (noopThunk as unknown as AsyncThunk<T[], void, { rejectValue: string }>);

	const fetchByParamThunk = fetchByParam
		? createThunkWithErrorHandling<{ param: P; data: T[] }, P>(
				`${name}${CRUD_ACTION_SUFFIXES.FETCH_BY_PARAM}`,
				async (param) => {
					const data = await fetchByParam(param);
					return { param, data };
				},
			)
		: (noopThunk as unknown as AsyncThunk<
				{ param: P; data: T[] },
				P,
				{ rejectValue: string }
			>);

	const createOneThunk = createThunkWithErrorHandling<T, C>(
		`${name}${CRUD_ACTION_SUFFIXES.CREATE_ONE}`,
		createOne,
	);

	const updateOneThunk = createThunkWithErrorHandling<T, U>(
		`${name}${CRUD_ACTION_SUFFIXES.UPDATE_ONE}`,
		updateOne,
	);

	const deleteOneThunk = createThunkWithErrorHandling<string, string>(
		`${name}${CRUD_ACTION_SUFFIXES.DELETE_ONE}`,
		async (id) => {
			await deleteOne(id);
			return id;
		},
	);

	// ──────────────────────────────
	// Initial State
	// ──────────────────────────────
	const initialState = adapter.getInitialState({
		loading: ENTITY_LOADING_STATUSES.IDLE as EntityLoadingStatus,
		error: null as string | null,
	});

	type SliceState = typeof initialState;

	// ──────────────────────────────
	// Slice Definition
	// ──────────────────────────────
	const slice = createSlice({
		name,
		initialState,
		reducers: {
			clearError(state) {
				state.error = null;
			},
			reset: () => initialState,
		},
		extraReducers: (builder) => {
			const handlePending = (state: Draft<SliceState>) => {
				state.loading = ENTITY_LOADING_STATUSES.PENDING;
				state.error = null;
			};

			const handleRejected = (
				state: Draft<SliceState>,
				action: { payload?: string; error: { message?: string } },
			) => {
				state.loading = ENTITY_LOADING_STATUSES.FAILED;
				state.error =
					action.payload ??
					action.error.message ??
					PROJECT_MESSAGES.ERROR_ACTION;
			};

			const handleFulfilled = (state: Draft<SliceState>) => {
				state.loading = ENTITY_LOADING_STATUSES.SUCCEEDED;
				state.error = null;
			};

			const addFulfilled = <R, A>(
				thunk: AsyncThunk<R, A, { rejectValue: string }> | undefined,
				handler: (state: Draft<SliceState>, payload: R) => void,
			): void => {
				if (thunk) {
					builder.addCase(thunk.fulfilled, (state, action) => {
						handler(state, action.payload);
						handleFulfilled(state);
					});
				}
			};

			// Fulfilled cases
			addFulfilled(fetchAllThunk, (s, p) => adapter.setAll(s, p));
			addFulfilled(fetchByParamThunk, (s, p) => adapter.setAll(s, p.data));
			addFulfilled(createOneThunk, (s, p) => adapter.addOne(s, p));
			addFulfilled(updateOneThunk, (s, p) => adapter.upsertOne(s, p));
			addFulfilled(deleteOneThunk, (s, p) => adapter.removeOne(s, p));

			// Pending & Rejected matchers
			type AnyThunk =
				| typeof fetchAllThunk
				| typeof fetchByParamThunk
				| typeof createOneThunk
				| typeof updateOneThunk
				| typeof deleteOneThunk;

			const allThunks: Exclude<AnyThunk, undefined>[] = [
				fetchAllThunk,
				fetchByParamThunk,
				createOneThunk,
				updateOneThunk,
				deleteOneThunk,
			].filter((t): t is Exclude<AnyThunk, undefined> => t !== undefined);

			allThunks.forEach((thunk) => {
				builder
					.addMatcher(thunk.pending.match, handlePending)
					.addMatcher(thunk.rejected.match, handleRejected);
			});
		},
	});

	// ──────────────────────────────
	// Selectors
	// ──────────────────────────────
	function makeSelectors<RootState>(selectSlice: (state: RootState) => SliceState) {
		const base = adapter.getSelectors(selectSlice);

		const selectByName = createSelector(
			[base.selectAll, (_: RootState, query: string) => query.trim().toLowerCase()],
			(entities, q) =>
				q
					? entities.filter((i) => (i.name ?? '').toLowerCase().includes(q))
					: entities,
		);

		const selectIsLoading = createSelector(
			[selectSlice],
			(s) => s.loading === ENTITY_LOADING_STATUSES.PENDING,
		);

		const selectError = createSelector([selectSlice], (s) => s.error);

		return { ...base, selectByName, selectIsLoading, selectError };
	}

	// ──────────────────────────────
	// Public API
	// ──────────────────────────────
	return {
		reducer: slice.reducer,
		actions: slice.actions,
		adapter,
		thunks: {
			fetchAllThunk,
			fetchByParamThunk,
			createOneThunk,
			updateOneThunk,
			deleteOneThunk,
		},
		makeSelectors,
	} as const;
}
