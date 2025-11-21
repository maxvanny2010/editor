export async function applyLayerSnapshots(
	layers: { id: string; snapshot?: string }[],
	getCanvas: (id: string) => HTMLCanvasElement | null,
	width: number,
	height: number,
): Promise<void> {
	for (const layer of layers) {
		const canvas = getCanvas(layer.id);
		if (!canvas) continue;
		const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
		if (!ctx) continue;

		ctx.clearRect(0, 0, width, height);

		if (layer.snapshot) {
			const img = new Image();
			img.src = layer.snapshot;
			await new Promise((res) => (img.onload = res));
			ctx.drawImage(img, 0, 0);
		}
	}
}
