import React, {
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { motion } from 'framer-motion';

export type EditorCanvasProps = {
	width: number;
	height: number;
	background?: string;
	padding?: number;
	autoResize?: boolean;
	onReady?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
	onPointerDown?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	onPointerMove?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	onPointerUp?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
	className?: string;
	'data-testid'?: string;
};

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

export const EditorCanvas = memo(
	forwardRef<HTMLCanvasElement, EditorCanvasProps>(
		(
			{
				width,
				height,
				background = '#ffffff',
				padding = 24,
				autoResize = true,
				onReady,
				onPointerDown,
				onPointerMove,
				onPointerUp,
				className = '',
				'data-testid': testId = 'editor-canvas',
			},
			forwardedRef,
		) => {
			const localCanvasRef = useRef<HTMLCanvasElement | null>(null);

			const setCanvasRef = useCallback(
				(node: HTMLCanvasElement | null) => {
					localCanvasRef.current = node;
					if (typeof forwardedRef === 'function') forwardedRef(node);
					else if (forwardedRef && 'current' in forwardedRef)
						forwardedRef.current = node;
				},
				[forwardedRef],
			);

			const [scale, setScale] = useState(1);

			const hostRef = useResizeObserver<HTMLDivElement>(
				true,
				useCallback(
					(rect) => {
						if (!autoResize) return;
						const availW = rect.width - padding * 2;
						const availH = rect.height - padding * 2;
						const next = Math.min(availW / width, availH / height);
						setScale((prev) => (Math.abs(prev - next) > 0.001 ? next : prev));
					},
					[autoResize, height, padding, width],
				),
			);

			useEffect(() => {
				const canvas = localCanvasRef.current;
				if (!canvas) return;

				const dpr = Math.max(1, window.devicePixelRatio || 1);
				canvas.width = Math.round(width * dpr);
				canvas.height = Math.round(height * dpr);
				canvas.style.width = `${width}px`;
				canvas.style.height = `${height}px`;

				const ctx = canvas.getContext('2d');
				if (!ctx) return;

				ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
				ctx.fillStyle = background;
				ctx.fillRect(0, 0, width, height);
				onReady?.(ctx, canvas);
			}, [background, height, onReady, width]);

			return (
				<div
					ref={hostRef}
					className={`relative h-full w-full overflow-hidden ${className}`}
					data-testid={`${testId}-host`}
				>
					<div
						className="absolute inset-0 flex items-center justify-center"
						style={{ padding }}
					>
						<div className="relative bg-gray-100 dark:bg-gray-800 rounded-md shadow-md p-1">
							<motion.div
								style={{ transformOrigin: 'top left', scale }}
								initial={false}
								aria-label="canvas-scale-holder"
							>
								<canvas
									ref={setCanvasRef}
									width={width}
									height={height}
									onPointerDown={onPointerDown}
									onPointerMove={onPointerMove}
									onPointerUp={onPointerUp}
									style={{
										background,
										borderRadius: '0.25rem',
										border: '1px solid rgba(0,0,0,0.1)',
									}}
									className="block"
									data-testid={testId}
								/>
							</motion.div>
						</div>
					</div>
				</div>
			);
		},
	),
);
