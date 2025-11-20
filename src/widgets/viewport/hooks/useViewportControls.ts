import React, { useCallback, useRef, useState } from 'react';

type Writeable<T> = {
	-readonly [P in keyof T]: T[P];
};

type ViewportControlsResult = {
	containerRef: Writeable<React.RefObject<HTMLDivElement | null>>;
	scaleRef: Writeable<React.RefObject<number>>;
	offsetXRef: Writeable<React.RefObject<number>>;
	offsetYRef: Writeable<React.RefObject<number>>;
	isPanningRef: Writeable<React.RefObject<boolean>>;

	isPanning: boolean;

	showGrid: boolean;
	setShowGrid: React.Dispatch<React.SetStateAction<boolean>>;

	onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
	onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
	onMouseUp: () => void;
	onWheel: (e: React.WheelEvent<HTMLDivElement>) => void;

	handleFit: () => void;
	handleReset: () => void;
};

/**
 * Viewport controls in "Figma mode":
 * Direct DOM transforms for panning/zooming, no React re-renders on movement.
 */
export function useViewportControls(
	width: number,
	height: number,
): ViewportControlsResult {
	// container (writeable ref)
	const containerRef = useRef<HTMLDivElement | null>(null) as Writeable<
		React.RefObject<HTMLDivElement | null>
	>;

	// transform state (writeable refs, TS-safe)
	const scaleRef = useRef(1) as Writeable<React.RefObject<number>>;
	const offsetXRef = useRef(0) as Writeable<React.RefObject<number>>;
	const offsetYRef = useRef(0) as Writeable<React.RefObject<number>>;
	const isPanningRef = useRef(false) as Writeable<React.RefObject<boolean>>;

	const [isPanning, setIsPanning] = useState(false);
	const [showGrid, setShowGrid] = useState(true);

	const applyTransform = useCallback(() => {
		const el = containerRef.current;
		if (!el) return;

		el.style.transform = `translate(${offsetXRef.current}px, ${offsetYRef.current}px) scale(${scaleRef.current})`;
		el.style.transformOrigin = 'center';
	}, []);

	const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		if (e.button !== 1) return;
		e.preventDefault();
		isPanningRef.current = true;
		setIsPanning(true);
	}, []);

	const onMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!isPanningRef.current) return;
			offsetXRef.current += e.movementX;
			offsetYRef.current += e.movementY;
			applyTransform();
		},
		[applyTransform],
	);

	const onMouseUp = useCallback(() => {
		isPanningRef.current = false;
		setIsPanning(false);
	}, []);

	const onWheel = useCallback(
		(e: React.WheelEvent<HTMLDivElement>) => {
			if (!e.ctrlKey) return;
			e.preventDefault();

			const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
			scaleRef.current *= zoomFactor;

			applyTransform();
		},
		[applyTransform],
	);

	const handleFit = useCallback(() => {
		const el = containerRef.current;
		if (!el) return;

		const parent = el.parentElement;
		if (!parent) return;

		const rect = parent.getBoundingClientRect();
		const padding = 64;

		const availW = rect.width - padding * 2;
		const availH = rect.height - padding * 2;

		const scaleX = availW / width;
		const scaleY = availH / height;

		scaleRef.current = Math.min(scaleX, scaleY);
		offsetXRef.current = 0;
		offsetYRef.current = 0;

		applyTransform();
	}, [applyTransform, width, height]);

	const handleReset = useCallback(() => {
		scaleRef.current = 1;
		offsetXRef.current = 0;
		offsetYRef.current = 0;
		applyTransform();
	}, [applyTransform]);

	return {
		containerRef,
		scaleRef,
		offsetXRef,
		offsetYRef,
		isPanningRef,
		isPanning,
		showGrid,
		setShowGrid,
		onMouseDown,
		onMouseMove,
		onMouseUp,
		onWheel,
		handleFit,
		handleReset,
	};
}
