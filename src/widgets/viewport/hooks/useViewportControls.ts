import React, { useCallback, useRef, useState } from 'react';

interface ViewportChange {
	scale: number;
	offsetX: number;
	offsetY: number;
}

export function useViewportControls(
	width: number,
	height: number,
	onChange?: (data: ViewportChange) => void,
) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	// внутренние рефы
	const scaleRef = useRef(1);
	const offsetXRef = useRef(0);
	const offsetYRef = useRef(0);

	const [isPanning, setIsPanning] = useState(false);
	const [showGrid, setShowGrid] = useState(true);

	const emit = useCallback(() => {
		onChange?.({
			scale: scaleRef.current,
			offsetX: offsetXRef.current,
			offsetY: offsetYRef.current,
		});
	}, [onChange]);

	const applyTransform = useCallback(() => {
		const el = containerRef.current;
		if (!el) return;

		el.style.transform = `translate(${offsetXRef.current}px, ${offsetYRef.current}px) scale(${scaleRef.current})`;
		el.style.transformOrigin = 'center';

		emit();
	}, [emit]);

	const onMouseDown = useCallback((mouseEvent: React.MouseEvent<HTMLDivElement>) => {
		if (mouseEvent.button !== 1) return;
		mouseEvent.preventDefault();
		setIsPanning(true);
	}, []);

	const onMouseMove = useCallback(
		(mouseEvent: React.MouseEvent<HTMLDivElement>) => {
			if (!isPanning) return;
			offsetXRef.current += mouseEvent.movementX;
			offsetYRef.current += mouseEvent.movementY;
			applyTransform();
		},
		[applyTransform, isPanning],
	);

	const onMouseUp = useCallback(() => {
		setIsPanning(false);
	}, []);

	const onWheel = useCallback(
		(wheelEvent: React.WheelEvent<HTMLDivElement>) => {
			if (!wheelEvent.ctrlKey) return;
			if (wheelEvent.cancelable) wheelEvent.preventDefault();

			const zoomFactor = wheelEvent.deltaY > 0 ? 0.9 : 1.1;
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
