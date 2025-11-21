import { useEffect, useState } from 'react';

export function useDelayedSkeleton(isLoading: boolean, delay = 300) {
	const [show, setShow] = useState(isLoading);

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | null = null;
		let isMounted = true;

		if (isLoading) {
			setShow(true);
		} else {
			timer = setTimeout(() => {
				if (isMounted) setShow(false);
			}, delay);
		}

		return () => {
			isMounted = false;
			if (timer) clearTimeout(timer);
		};
	}, [isLoading, delay]);

	return show;
}
