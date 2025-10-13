import { createEntityAdapter, type EntityState } from '@reduxjs/toolkit';

/**
 * Generic selector factory for entity-based slices.
 *
 * @template RootState - The full Redux root state
 * @template T - Entity type (must include `id`)
 * @template Id - ID type, defaults to string
 */
export function makeSelectors<
	RootState,
	T extends { id: Id; name?: string },
	Id extends string | number = string,
>(
	selectSlice: (state: RootState) => EntityState<T, Id> & {
		loading: 'idle' | 'pending' | 'succeeded' | 'failed';
		error: string | null;
	},
	sortComparer?: (a: T, b: T) => number,
) {
	const adapter = createEntityAdapter<T, Id>({
		selectId: (entity) => entity.id,
		sortComparer,
	});

	const base = adapter.getSelectors(selectSlice);

	return {
		...base,

		/**
		 * Extended selector: performs case-insensitive substring search by `name`
		 * @param state - Redux root state
		 * @param query - Search string
		 */
		selectByName(state: RootState, query: string): T[] {
			const q = query.trim().toLowerCase();
			return base
				.selectAll(state)
				.filter((item) => (item.name ?? '').toLowerCase().includes(q));
		},
	};
}
