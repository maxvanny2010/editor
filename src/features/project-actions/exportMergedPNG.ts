export async function exportMergedPNG(): Promise<string> {
	const canvases = Array.from(
		document.querySelectorAll<HTMLCanvasElement>('[data-layer-id], #draw-canvas'),
	);

	if (canvases.length === 0) return '';

	const base = canvases[0];
	const merged = document.createElement('canvas');
	merged.width = base.width;
	merged.height = base.height;

	const ctx = merged.getContext('2d', { willReadFrequently: true, alpha: true })!;

	// Get a current background of editor
	ctx.fillStyle = window.getComputedStyle(document.body).backgroundColor || '#ffffff';
	ctx.fillRect(0, 0, merged.width, merged.height);

	// Draw layers
	for (const c of canvases) ctx.drawImage(c, 0, 0);

	return merged.toDataURL('image/png');
}
