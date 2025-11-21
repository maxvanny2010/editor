import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDelayedSkeleton } from '@/shared/lib/hooks';

describe('useDelayedSkeleton', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should immediately return true when isLoading is true', () => {
		const { result } = renderHook(() => useDelayedSkeleton(true));
		expect(result.current).toBe(true);
	});

	it('should immediately return false when isLoading is false', () => {
		const { result } = renderHook(() => useDelayedSkeleton(false));
		expect(result.current).toBe(false);
	});

	it('should remain visible for the delay duration after isLoading becomes false', () => {
		const { result, rerender } = renderHook(
			({ isLoading }) => useDelayedSkeleton(isLoading, 300),
			{ initialProps: { isLoading: true } },
		);

		expect(result.current).toBe(true);

		rerender({ isLoading: false });
		expect(result.current).toBe(true);

		act(() => {
			vi.advanceTimersByTime(299);
		});
		expect(result.current).toBe(true);

		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(result.current).toBe(false);
	});

	it('should show the skeleton again when isLoading returns to true', () => {
		const { result, rerender } = renderHook(
			({ isLoading }) => useDelayedSkeleton(isLoading, 200),
			{ initialProps: { isLoading: true } },
		);

		rerender({ isLoading: false });

		act(() => {
			vi.runAllTimers();
		});
		expect(result.current).toBe(false);

		rerender({ isLoading: true });
		expect(result.current).toBe(true);
	});

	it('should clear the timer on unmount', () => {
		const { unmount } = renderHook(() => useDelayedSkeleton(false, 500));
		const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

		unmount();

		expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

		clearTimeoutSpy.mockRestore();
	});
});
