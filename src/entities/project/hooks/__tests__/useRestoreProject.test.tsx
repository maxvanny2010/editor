import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNavigate } from 'react-router-dom';
import { renderHook, waitFor } from '@testing-library/react';
import type { AppDispatch } from '@/store';
import { activeProjectService } from '@/entities/settings/model';
import { useRestoreProject } from '@/entities/project/hooks';

vi.mock('react-router-dom', () => ({
	useNavigate: vi.fn(),
}));

vi.mock('@/entities/settings/model');

const svc = vi.mocked(activeProjectService);
type NavigateFn = ReturnType<typeof useNavigate>;

describe('useRestoreProject', () => {
	let mockDispatch: AppDispatch;
	let mockNavigate: NavigateFn;

	beforeEach(() => {
		vi.clearAllMocks();

		mockDispatch = vi.fn() as AppDispatch;
		mockNavigate = vi.fn() as NavigateFn;
		(useNavigate as Mock).mockReturnValue(mockNavigate);
	});

	it('returns loading true initially', async () => {
		svc.restoreIntoEditor.mockResolvedValue('p1');

		const { result } = renderHook(() => useRestoreProject(mockDispatch, 'p1'));

		expect(result.current).toBe(true);

		// Cleanup
		await waitFor(() => expect(result.current).toBe(false));
	});

	it('returns loading false after successful restoration', async () => {
		svc.restoreIntoEditor.mockResolvedValue('p1');

		const { result } = renderHook(() => useRestoreProject(mockDispatch, 'p1'));

		await waitFor(() => {
			expect(result.current).toBe(false);
		});
	});

	it('navigates on fail', async () => {
		svc.restoreIntoEditor.mockResolvedValue(null);

		renderHook(() => useRestoreProject(mockDispatch, 'bad'));

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith(expect.any(String), {
				state: { noProject: true },
			});
		});
	});

	it('runs only once', async () => {
		svc.restoreIntoEditor.mockResolvedValue('x');

		const { rerender } = renderHook(() => useRestoreProject(mockDispatch, 'x'));

		rerender();
		rerender();

		await waitFor(() => {
			expect(svc.restoreIntoEditor).toHaveBeenCalledTimes(1);
		});
	});

	it('handles undefined projectId', async () => {
		svc.restoreIntoEditor.mockResolvedValue(null);

		renderHook(() => useRestoreProject(mockDispatch, undefined));

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalled();
		});
	});

	it('calls service with correct args', async () => {
		svc.restoreIntoEditor.mockResolvedValue('p2');

		renderHook(() => useRestoreProject(mockDispatch, 'p2'));

		await waitFor(() => {
			expect(svc.restoreIntoEditor).toHaveBeenCalledWith(mockDispatch, 'p2');
		});
	});
});
