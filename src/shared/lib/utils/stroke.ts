export type StrokeMode = 'screen' | 'world';

export function strokeWidth(size: number, viewportScale: number, mode: StrokeMode) {
	return mode === 'screen' ? size / Math.max(0.0001, viewportScale) : size;
}
