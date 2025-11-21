export function snapAngle45(dx: number, dy: number) {
	const angle = Math.atan2(dy, dx);
	const step = Math.PI / 4;
	const snapped = Math.round(angle / step) * step;
	const len = Math.hypot(dx, dy);
	return { dx: Math.cos(snapped) * len, dy: Math.sin(snapped) * len };
}

export function normalizeLine(
	p0: { x: number; y: number },
	p1: { x: number; y: number },
	shift: boolean,
) {
	let dx = p1.x - p0.x;
	let dy = p1.y - p0.y;
	if (shift && (dx !== 0 || dy !== 0)) ({ dx, dy } = snapAngle45(dx, dy));
	return { x1: p0.x, y1: p0.y, x2: p0.x + dx, y2: p0.y + dy };
}
