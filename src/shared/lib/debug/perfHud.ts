import { METRIC_FPS, METRIC_FRAME, METRIC_LOST, METRIC_MAX } from '@/shared/constants';

export function startPerfHUD() {
	const container = document.createElement('div');
	container.style.position = 'fixed';
	container.style.left = '12px';
	container.style.bottom = '80px';
	container.style.background = 'rgba(0,0,0,0.55)';
	container.style.color = 'lime';
	container.style.fontFamily = 'monospace';
	container.style.fontSize = '12px';
	container.style.padding = '6px 10px';
	container.style.borderRadius = '6px';
	container.style.zIndex = '99999';
	container.style.pointerEvents = 'none';
	container.style.whiteSpace = 'pre';
	container.style.lineHeight = '1.3';
	document.body.appendChild(container);

	let last = performance.now();
	let frameCount = 0;

	let fps = 0;
	let frameTime = 0;
	let lost = 0; // count frame > 16.6ms
	let maxFrame = 0;

	function loop(now: number) {
		frameCount++;

		const delta = now - last;
		if (delta >= 1000) {
			fps = frameCount;
			frameTime = +(delta / frameCount).toFixed(2);
			maxFrame = Math.max(maxFrame, frameTime);
			lost = frameTime > 16.6 ? lost + 1 : lost;

			frameCount = 0;
			last = now;

			container.textContent = [
				METRIC_FPS(fps),
				METRIC_FRAME(frameTime),
				METRIC_MAX(maxFrame),
				METRIC_LOST(lost),
			].join('\n');
		}

		requestAnimationFrame(loop);
	}

	requestAnimationFrame(loop);
}
