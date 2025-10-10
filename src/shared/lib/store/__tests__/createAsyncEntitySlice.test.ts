import { describe, expect, it, vi } from 'vitest';
import { createAsyncEntitySlice } from '../createAsyncEntitySlice';
import { PROJECT_MESSAGES } from '@/shared/constants/projectMessages.ts';

describe('createAsyncEntitySlice', () => {
	const fetchAll = vi.fn(async () => [{ id: '1', name: 'Alpha' }]);
	const createOne = vi.fn(async (data: { name: string }) => ({
		id: '2',
		name: data.name,
	}));
	const updateOne = vi.fn(async (data: { id: string; name: string }) => data);
	const deleteOne = vi.fn(async () => undefined);

	const slice = createAsyncEntitySlice({
		name: 'test',
		fetchAll,
		createOne,
		updateOne,
		deleteOne,
	});

	const { reducer, thunks, makeSelectors } = slice;

	it('should handle pending action correctly', () => {
		const prevState = reducer(undefined, { type: 'unknown' });
		const nextState = reducer(prevState, {
			type: thunks.createOneThunk.pending.type,
		});
		expect(nextState.loading).toBe('pending');
	});

	it('should set error and failed state on rejected actions', () => {
		const errorAction = {
			type: thunks.fetchAllThunk.rejected.type,
			error: { message: 'Boom!' },
		};
		const state = reducer(undefined, errorAction);
		expect(state.loading).toBe('failed');
		expect(state.error).toBe('Boom!');
	});

	it('should clear error when clearError is called', () => {
		const erroredState = {
			ids: [],
			entities: {},
			loading: 'failed' as const,
			error: 'Oops',
		};
		const action = { type: slice.actions.clearError.type };
		const newState = reducer(erroredState, action);
		expect(newState.error).toBeNull();
	});

	it('selectByName should return filtered entities', () => {
		const fakeState = {
			test: {
				ids: ['1', '2'],
				entities: {
					'1': { id: '1', name: 'Alpha' },
					'2': { id: '2', name: 'Beta' },
				},
				loading: 'idle' as const,
				error: null,
			},
		};

		const selectors = makeSelectors((s: typeof fakeState) => s.test);
		const result = selectors.selectByName(fakeState, 'alp');
		expect(result).toEqual([{ id: '1', name: 'Alpha' }]);
	});
	it('should use default error message if error.message is undefined', () => {
		const action = {
			type: thunks.fetchAllThunk.rejected.type,
			error: {},
		};
		const state = reducer(undefined, action);
		expect(state.error).toBe(PROJECT_MESSAGES.ERROR_ACTION);
	});

	it('selectByName should handle items without name field', () => {
		const fakeState = {
			test: {
				ids: ['1', '2'],
				entities: {
					'1': { id: '1' }, // no name
					'2': { id: '2', name: 'Alpha' },
				},
				loading: 'idle' as const,
				error: null,
			},
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const selectors = makeSelectors((s: any) => s.test);

		const result = selectors.selectByName(fakeState, 'alp');
		expect(result).toEqual([{ id: '2', name: 'Alpha' }]);
	});
});
