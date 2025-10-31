import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';
import { webcrypto } from 'crypto';

// ─── Fix: mock window.scrollTo to prevent jsdom warnings ───────────────
Object.defineProperty(window, 'scrollTo', {
	value: vi.fn(),
	writable: true,
});

// ─── Mock framer-motion for deterministic tests ─────────────────────────────
vi.mock('framer-motion', async () => {
	const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
	const mock = await import('@/__mocks__/framer-motion');
	return { ...actual, ...mock };
});

// ─── CRYPTO POLYFILL ────────────────────────────────
if (!globalThis.crypto) {
	Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
}

// ─── Canvas getContext mock ──────────────────────────────────────────────────
// Prevent "Not implemented: HTMLCanvasElement.getContext()" in JSDOM
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
	value: vi.fn(() => ({
		fillRect: vi.fn(),
		clearRect: vi.fn(),
		getImageData: vi.fn(),
		putImageData: vi.fn(),
		createImageData: vi.fn(),
		setTransform: vi.fn(),
		drawImage: vi.fn(),
		save: vi.fn(),
		restore: vi.fn(),
		fillStyle: '',
		fillText: vi.fn(),
		beginPath: vi.fn(),
		moveTo: vi.fn(),
		lineTo: vi.fn(),
		stroke: vi.fn(),
		strokeStyle: '',
		lineWidth: 1,
		closePath: vi.fn(),
	})),
});

// ─── ResizeObserver mock ─────────────────────────────────────────────────────
// Prevent "ResizeObserver is not defined" and emulate resize events
class MockResizeObserver {
	static instances: MockResizeObserver[] = [];
	private cb: (entries: Array<{ contentRect: Partial<DOMRectReadOnly> }>) => void;

	constructor(cb: (entries: Array<{ contentRect: Partial<DOMRectReadOnly> }>) => void) {
		this.cb = cb;
		MockResizeObserver.instances.push(this);
	}

	static trigger(rect: Partial<DOMRectReadOnly>) {
		for (const instance of MockResizeObserver.instances) {
			instance.cb([{ contentRect: rect }]);
		}
	}

	observe(): void {}

	unobserve(): void {}

	disconnect(): void {}
}

// @ts-expect-error - override global
global.ResizeObserver = MockResizeObserver;
