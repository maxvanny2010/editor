import { useEffect, useState } from 'react';

export function useDelayedSkeleton(isLoading: boolean, delay = 200) {
	const [show, setShow] = useState(isLoading);

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | undefined;

		if (!isLoading) {
			timer = setTimeout(() => setShow(false), delay);
		} else {
			setShow(true);
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [isLoading, delay]);

	return show;
}
