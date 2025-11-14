import type { Layer } from '@/shared/types';

interface LayerStackProps {
	layers: Layer[];
	width: number;
	height: number;
	bindCanvasRef: (id: string) => (el: HTMLCanvasElement | null) => void;
	activeLayerId?: string | null;
}

/**
 * Renders all project layers as static canvases.
 * These canvases are now non-interactive (pointer-events: none),
 * so pointer input passes through to the DrawCanvas above.
 */
export const LayerStack = ({
	layers,
	width,
	height,
	bindCanvasRef,
	activeLayerId,
}: LayerStackProps) => {
	return (
		<>
			{layers.map((layer) => {
				const isActive = layer.id === activeLayerId;
				return (
					<canvas
						key={layer.id}
						id={`layer-canvas-${layer.id}`}
						data-layer-id={layer.id}
						ref={bindCanvasRef(layer.id)}
						width={width}
						height={height}
						style={{
							position: 'absolute',
							inset: 0,
							opacity: layer.visible ? layer.opacity : 0,
							pointerEvents: 'none',
							boxShadow: isActive
								? '0 0 10px 3px rgba(59,130,246,0.5)'
								: 'none',
							backgroundColor: 'transparent',
							zIndex: layer.zIndex,
							transition: 'box-shadow 0.25s ease-in-out',
						}}
					/>
				);
			})}
		</>
	);
};
