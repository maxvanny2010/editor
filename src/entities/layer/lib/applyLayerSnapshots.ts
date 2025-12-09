export async function applyLayerSnapshots(
	layers: { id: string; snapshot?: string }[],
	getCanvas: (id: string) => HTMLCanvasElement | null,
	width: number,
	height: number,
): Promise<void> {
	for (const layer of layers) {
		const canvas = getCanvas(layer.id);
		if (!canvas) continue;
		const context2D = canvas.getContext('2d', { willReadFrequently: true })!;
		if (!context2D) continue;

		context2D.clearRect(0, 0, width, height);

		if (layer.snapshot) {
			const img = new Image();
			img.src = layer.snapshot;
			await new Promise((res) => (img.onload = res));
			context2D.drawImage(img, 0, 0);
		}
	}
}
