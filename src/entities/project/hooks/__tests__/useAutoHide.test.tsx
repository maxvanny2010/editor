import { renderHook } from '@testing-library/react';
import { useAutoHide } from '@/entities/project/hooks';

describe('useAutoHide', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('calls onHide after specified duration when show is true', () => {
		const onHide = vi.fn();

		renderHook(() => useAutoHide(true, 2000, onHide));

		expect(onHide).not.toHaveBeenCalled();

		vi.advanceTimersByTime(2000);

		expect(onHide).toHaveBeenCalledTimes(1);
	});

	it('does not call onHide when show is false', () => {
		const onHide = vi.fn();

		renderHook(() => useAutoHide(false, 2000, onHide));

		vi.advanceTimersByTime(2000);

		expect(onHide).not.toHaveBeenCalled();
	});

	it('clears timeout on unmount', () => {
		const onHide = vi.fn();

		const { unmount } = renderHook(() => useAutoHide(true, 2000, onHide));

		unmount();
		vi.advanceTimersByTime(2000);

		expect(onHide).not.toHaveBeenCalled();
	});

	it('resets timer when show changes', () => {
		const onHide = vi.fn();

		const { rerender } = renderHook(({ show }) => useAutoHide(show, 2000, onHide), {
			initialProps: { show: true },
		});

		vi.advanceTimersByTime(1000);

		rerender({ show: false });
		vi.advanceTimersByTime(1000);

		expect(onHide).not.toHaveBeenCalled();

		rerender({ show: true });
		vi.advanceTimersByTime(2000);

		expect(onHide).toHaveBeenCalledTimes(1);
	});

	it('handles duration changes', () => {
		const onHide = vi.fn();

		const { rerender } = renderHook(
			({ duration }) => useAutoHide(true, duration, onHide),
			{ initialProps: { duration: 1000 } },
		);

		vi.advanceTimersByTime(500);

		rerender({ duration: 2000 });
		vi.advanceTimersByTime(1500);

		expect(onHide).not.toHaveBeenCalled();

		vi.advanceTimersByTime(500);

		expect(onHide).toHaveBeenCalledTimes(1);
	});
});
