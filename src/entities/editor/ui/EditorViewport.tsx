import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { EditorCanvas } from '@/widgets/canvas/model';
import { projectsSelectors } from '@/entities/project/model';
import { selectViewport } from '@/entities/editor/model/selectors';
import { resetViewport, setOffset, setScale } from '@/entities/editor/model/slice';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const GRID_SPACING = 20;
const LABEL_SPACING = 100;
const PADDING = 64;

export const EditorViewport = () => {
	const active = useAppSelector(projectsSelectors.selectActiveProject);
	const width = active?.width ?? CANVAS_WIDTH;
	const height = active?.height ?? CANVAS_HEIGHT;
	const dispatch = useAppDispatch();
	const { scale, offsetX, offsetY } = useAppSelector(selectViewport);

	const containerRef = useRef<HTMLDivElement | null>(null);
	const panRef = useRef<{ x: number; y: number } | null>(null);
	const [fitScale, setFitScale] = useState(1);

	// --- Fit-to-window ---
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
	}, [height, width]);

	// --- Ctrl + Wheel Zoom ---
	useEffect(() => {
		const node = containerRef.current;
		if (!node) return;

		const handleWheel = (e: WheelEvent) => {
			if (e.ctrlKey) {
				e.preventDefault();
				const nextScale = scale * (e.deltaY > 0 ? 0.9 : 1.1);
				dispatch(setScale(nextScale));
			}
		};

		node.addEventListener('wheel', handleWheel, { passive: false });
		return () => node.removeEventListener('wheel', handleWheel);
	}, [dispatch, scale]);

	// --- Mouse Panning ---
	const handleMouseDown = (e: React.MouseEvent) => {
		if (e.button === 1) {
			e.preventDefault();
			panRef.current = { x: e.clientX, y: e.clientY };
		}
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!panRef.current) return;
		const dx = e.clientX - panRef.current.x;
		const dy = e.clientY - panRef.current.y;
		dispatch(setOffset({ x: offsetX + dx, y: offsetY + dy }));
		panRef.current = { x: e.clientX, y: e.clientY };
	};

	const handleMouseUp = () => (panRef.current = null);
	const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();

	// --- Reset Animation ---
	const handleReset = () => {
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
	};

	// --- Fit to screen ---
	const handleFit = () => dispatch(setScale(fitScale));

	// --- Draw grid ---
	const drawGrid = (ctx: CanvasRenderingContext2D) => {
		ctx.save();
		ctx.strokeStyle = '#e5e7eb';
		ctx.lineWidth = 1;

		for (let x = 0; x <= width; x += GRID_SPACING) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
			ctx.stroke();
		}

		for (let y = 0; y <= height; y += GRID_SPACING) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(width, y);
			ctx.stroke();
		}

		ctx.fillStyle = '#9ca3af';
		ctx.font = '10px sans-serif';

		for (let x = 0; x <= width; x += LABEL_SPACING) {
			ctx.fillText(String(x), x + 2, 12);
		}
		for (let y = 0; y <= height; y += LABEL_SPACING) {
			ctx.fillText(String(y), 2, y - 2);
		}
		ctx.restore();
	};

	// --- Render ---
	return (
		<div
			data-testid="viewport-container"
			ref={containerRef}
			className="relative w-full h-full bg-gray-100 dark:bg-gray-900 select-none overflow-hidden flex items-center justify-center"
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onContextMenu={handleContextMenu}
		>
			<div
				style={{
					width: width,
					height: height,
					transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
					transformOrigin: 'center',
					border: '1px solid rgba(0,0,0,0.2)',
					boxShadow: '0 0 10px rgba(0,0,0,0.1)',
					background: '#ffffff',
				}}
			>
				<EditorCanvas
					width={width}
					height={height}
					background="#ffffff"
					autoResize={false}
					onReady={drawGrid}
				/>
			</div>

			{/* --- Controls --- */}
			<div className="absolute bottom-3 right-3 flex gap-2 items-center text-xs text-gray-700 dark:text-gray-300">
				<div className="bg-white/70 dark:bg-gray-800/70 px-2 py-1 rounded-md">
					Zoom: {(scale * 100).toFixed(0)}% | Offset: {offsetX}, {offsetY}
				</div>

				<button
					type="button"
					data-testid="reset-button-testid"
					onClick={handleReset}
					className="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
				>
					Reset
				</button>

				<button
					type="button"
					data-testid="fit-button-testid"
					onClick={handleFit}
					className="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
				>
					Fit
				</button>
			</div>
		</div>
	);
};
