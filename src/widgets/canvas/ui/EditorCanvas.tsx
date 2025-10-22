import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// ─── TYPES ────────────────────────────────────────────────────────────────
export type EditorCanvasProps = {
	/** Logical width/height of the canvas in project units (px) */
	width: number;
	height: number;
	/** Canvas background color (default comes from theme via Tailwind) */
	background?: string;
	/** Minimal padding around the canvas inside its workspace */
	padding?: number;
	/** Enable or disable auto-resize based on container size */
	autoResize?: boolean;
	/** Callback when canvas is ready (used to initialize renderer/layers) */
	onReady?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
	/** Callback when scale changes (for syncing minimap/zoom lens, etc.) */
	onScaleChange?: (scale: number) => void;
	className?: string;
	'data-testid'?: string;
};

// ─── HOOK: Resize Observer Wrapper ───────────────────────────────────────
function useResizeObserver<T extends HTMLElement>(
	enabled: boolean,
	onResize: (rect: DOMRectReadOnly) => void,
) {
	const ref = useRef<T | null>(null);

	useLayoutEffect(() => {
		if (!enabled || !ref.current) return;
		const el = ref.current;
		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) onResize(entry.contentRect);
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, [enabled, onResize]);

	return ref;
}

// ─── MAIN COMPONENT: EditorCanvas ────────────────────────────────────────
export const EditorCanvas = memo(function EditorCanvas({
	width,
	height,
	background,
	padding = 24,
	autoResize = true,
	onReady,
	onScaleChange,
	className = '',
	'data-testid': testId = 'editor-canvas',
}: EditorCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [scale, setScale] = useState(1);

	// ─── OBSERVE HOST CONTAINER SIZE ────────────────────────────────────
	const hostRef = useResizeObserver<HTMLDivElement>(
		true,
		useCallback(
			(rect) => {
				if (!autoResize) return;

				// Calculate available width/height with padding subtracted
				const availW = Math.max(0, rect.width - padding * 2);
				const availH = Math.max(0, rect.height - padding * 2);
				if (availW === 0 || availH === 0) return;

				// Maintain proportions while fitting canvas into container
				const next = Math.min(availW / width, availH / height);
				setScale((prev) => {
					if (Math.abs(prev - next) > 0.001) {
						onScaleChange?.(next);
						return next;
					}
					return prev;
				});
			},
			[autoResize, height, onScaleChange, padding, width],
		),
	);

	// ─── INITIALIZE CANVAS (pixel ratio, transform, background) ─────────
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const dpr = Math.max(1, window.devicePixelRatio || 1);

		// Physical buffer size (hi-DPI support)
		canvas.width = Math.max(1, Math.round(width * dpr));
		canvas.height = Math.max(1, Math.round(height * dpr));

		// CSS size matches logical dimensions
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		// Optional solid background fill
		if (background) {
			ctx.save();
			ctx.fillStyle = background;
			ctx.fillRect(0, 0, width, height);
			ctx.restore();
		}

		onReady?.(ctx, canvas);
	}, [background, height, onReady, width]);

	// ─── BACKGROUND FALLBACK (theme-based) ───────────────────────────────
	const themeBg = background ?? 'transparent';

	// ─── RENDER ─────────────────────────────────────────────────────────
	return (
		<div
			ref={hostRef}
			className={`relative h-full w-full overflow-hidden ${className}`}
			data-testid={`${testId}-host`}
		>
			{/* ─── CENTERED WORK AREA ─────────────────────────────── */}
			<div
				className="absolute inset-0 flex items-center justify-center"
				style={{ padding }}
			>
				{/* Visual backdrop (light/dark theme surface) */}
				<div
					className="relative rounded-md shadow-sm outline-1 outline-black/5 dark:outline-white/10"
					style={{
						background: 'theme(colors.gray.50)',
					}}
				>
					{/* ─── SCALE HOLDER (animated with Framer Motion) ─── */}
					<motion.div
						style={{
							transformOrigin: 'top left',
							scale,
						}}
						initial={false}
						aria-label="canvas-scale-holder"
					>
						<canvas
							ref={canvasRef}
							width={width}
							height={height}
							style={{ background: themeBg }}
							className="block rounded-md"
							data-testid={testId}
						/>
					</motion.div>
				</div>
			</div>
		</div>
	);
});
