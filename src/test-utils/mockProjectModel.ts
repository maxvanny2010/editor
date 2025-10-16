import type { Mock } from 'vitest';

/**
 * Safe mock for project thunks (createProject, updateProject, deleteProject)
 * Uses `vi.doMock` to avoid hoisting issues during runtime.
 */
export async function mockProjectThunk<
	T extends keyof typeof import('@/entities/project/model'),
>(thunkName: T): Promise<[Mock, () => void]> {
	const actual = await vi.importActual<typeof import('@/entities/project/model')>(
		'@/entities/project/model',
	);

	const mockFn = vi.fn();

	vi.doMock('@/entities/project/model', () => ({
		...actual,
		[thunkName]: mockFn,
	}));

	const restore = () => {
		vi.clearAllMocks();
		vi.resetModules();
	};

	return [mockFn as Mock, restore];
}
