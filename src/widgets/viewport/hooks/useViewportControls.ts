import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ViewportRepository } from '@/widgets/viewport/api';
import { selectViewport } from '@/entities/editor/model/selectors';
import { resetViewport, setOffset, setScale } from '@/entities/editor/model/slice';

const PADDING = 64;

/**
 * Handles viewport scaling, panning, and fitting.
 * Persists state to Dexie if projectId is provided.
 */
export function useViewportControls(width: number, height: number, projectId?: string) {
	const { scale, offsetX, offsetY } = useAppSelector(selectViewport);
	const dispatch = useAppDispatch();
	const containerRef = useRef<HTMLDivElement | null>(null);
	const panRef = useRef<{ x: number; y: number } | null>(null);
	const [fitScale, setFitScale] = useState(1);
	const [showGrid, setShowGrid] = useState(true);
	const [isPanning, setIsPanning] = useState(false);

	// Load saved viewport state from Dexie
	useEffect(() => {
		if (!projectId) return;
		void (async () => {
			const saved = await ViewportRepository.get(projectId);
			if (saved) {
				dispatch(setScale(saved.scale));
				dispatch(setOffset({ x: saved.offsetX, y: saved.offsetY }));
				setShowGrid(saved.showGrid);
			}
		})();
	}, [dispatch, projectId]);

	// Autosave to Dexie every 2 seconds
	useEffect(() => {
		if (!projectId) return;
		const id = setInterval(() => {
			void ViewportRepository.save({
				projectId,
				scale,
				offsetX,
				offsetY,
				showGrid,
			});
		}, 2000);
		return () => clearInterval(id);
	}, [projectId, scale, offsetX, offsetY, showGrid]);

	// Compute fit scale based on container size
	useLayoutEffect(() => {
		const node = containerRef.current;
		if (!node) return;
		const updateFit = () => {
			const rect = node.getBoundingClientRect();
			const availW = Math.max(0, rect.width - PADDING * 2);
			const availH = Math.max(0, rect.height - PADDING * 2);
			setFitScale(Math.min(availW / width, availH / height));
		};
		updateFit();
		const ro = new ResizeObserver(updateFit);
		ro.observe(node);
		window.addEventListener('resize', updateFit);
		return () => {
			ro.disconnect();
			window.removeEventListener('resize', updateFit);
		};
	}, [width, height]);

	// Zoom with Ctrl + wheel
	useEffect(() => {
		const node = containerRef.current;
		if (!node) return;
		const handleWheel = (e: WheelEvent) => {
			if (!e.ctrlKey) return;
			e.preventDefault();
			const nextScale = scale * (e.deltaY > 0 ? 0.9 : 1.1);
			dispatch(setScale(nextScale));
		};
		node.addEventListener('wheel', handleWheel, { passive: false });
		return () => node.removeEventListener('wheel', handleWheel);
	}, [dispatch, scale]);

	// Panning logic
	const onMouseDown = useCallback((e: React.MouseEvent) => {
		if (e.button === 1) {
			e.preventDefault();
			panRef.current = { x: e.clientX, y: e.clientY };
			setIsPanning(true);
		}
	}, []);

	const onMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!panRef.current) return;
			dispatch(
				setOffset({
					x: offsetX + (e.clientX - panRef.current.x),
					y: offsetY + (e.clientY - panRef.current.y),
				}),
			);
			panRef.current = { x: e.clientX, y: e.clientY };
		},
		[dispatch, offsetX, offsetY],
	);

	const onMouseUp = useCallback(() => {
		panRef.current = null;
		setIsPanning(false);
	}, []);

	useEffect(() => {
		const handleGlobalMouseUp = () => setIsPanning(false);
		window.addEventListener('mouseup', handleGlobalMouseUp);
		return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
	}, []);

	// Smooth reset animation
	const handleReset = useCallback(() => {
		const startScale = scale;
		const startX = offsetX;
		const startY = offsetY;
		const startTime = performance.now();
		const duration = 300;

		const animate = (time: number) => {
			const t = Math.min(1, (time - startTime) / duration);
			const ease = 1 - Math.pow(1 - t, 3);
			const newScale = startScale + (1 - startScale) * ease;
			const newX = startX * (1 - ease);
			const newY = startY * (1 - ease);
			dispatch(setScale(newScale));
			dispatch(setOffset({ x: newX, y: newY }));
			if (t < 1) requestAnimationFrame(animate);
			else dispatch(resetViewport());
		};
		requestAnimationFrame(animate);
	}, [dispatch, offsetX, offsetY, scale]);

	const handleFit = useCallback(
		() => dispatch(setScale(fitScale)),
		[dispatch, fitScale],
	);

	return {
		containerRef,
		scale,
		offsetX,
		offsetY,
		showGrid,
		setShowGrid,
		handleFit,
		handleReset,
		onMouseDown,
		onMouseMove,
		onMouseUp,
		fitScale,
		isPanning,
	};
}
