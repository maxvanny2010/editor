import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDelayedSkeleton } from '@/shared/lib/hooks';

describe('useDelayedSkeleton', () => {
	it('returns true immediately when loading is true', () => {
		const { result } = renderHook(() => useDelayedSkeleton(true));
		expect(result.current).toBe(true);
	});

	it('returns false immediately when loading is false', () => {
		const { result } = renderHook(() => useDelayedSkeleton(false));
		expect(result.current).toBe(false);
	});

	it('keeps skeleton visible for delay after loading turns false', () => {
		vi.useFakeTimers();

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

		vi.useRealTimers();
	});

	it('shows skeleton again when loading returns to true', () => {
		vi.useFakeTimers();

		const { result, rerender } = renderHook(
			({ isLoading }) => useDelayedSkeleton(isLoading, 200),
			{ initialProps: { isLoading: true } },
		);

		rerender({ isLoading: false });
		act(() => {
			vi.advanceTimersByTime(250);
		});
		expect(result.current).toBe(false);

		rerender({ isLoading: true });
		expect(result.current).toBe(true);

		vi.useRealTimers();
	});
});
