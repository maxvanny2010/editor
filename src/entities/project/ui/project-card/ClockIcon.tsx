export function ClockIcon({ date }: { date: Date }) {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const hourAngle = (hours % 12) * 30 + minutes * 0.5;
	const minuteAngle = minutes * 6;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5 text-indigo-500 flex-shrink-0"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<line
				x1="12"
				y1="12"
				x2={12 + 3.5 * Math.sin((Math.PI / 180) * hourAngle)}
				y2={12 - 3.5 * Math.cos((Math.PI / 180) * hourAngle)}
			/>
			<line
				x1="12"
				y1="12"
				x2={12 + 5.5 * Math.sin((Math.PI / 180) * minuteAngle)}
				y2={12 - 5.5 * Math.cos((Math.PI / 180) * minuteAngle)}
			/>
		</svg>
	);
}
