import { normalizeLine, snapAngle45 } from '@/entities/line/model';

describe('snapAngle45', () => {
	it('snaps near 0° correctly', () => {
		const { dy } = snapAngle45(10, 1);
		expect(Math.abs(dy)).toBeLessThan(3);
	});

	it('snaps to 45° correctly', () => {
		const { dx, dy } = snapAngle45(10, 10);
		expect(Math.abs(Math.abs(dx) - Math.abs(dy))).toBeLessThan(0.01);
	});
});

describe('normalizeLine', () => {
	it('applies shift snapping', () => {
		const p0 = { x: 0, y: 0 };
		const p1 = { x: 3, y: 1 };
		const r = normalizeLine(p0, p1, true);
		expect(r.x2).toBeCloseTo(3.162, 1);
	});
});
