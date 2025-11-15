import { useEffect } from 'react';

export function useAutoHide(show: boolean, duration: number, onHide: () => void) {
	useEffect(() => {
		if (!show) return;
		const timer = setTimeout(onHide, duration);
		return () => clearTimeout(timer);
	}, [show, duration, onHide]);
}
