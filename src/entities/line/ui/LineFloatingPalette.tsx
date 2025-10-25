import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLineColor, setLineThickness } from '@/entities/line/model/slice';

const THICKNESSES = [1, 2, 4, 8, 12, 20];
const COLORS = [
	'#111827',
	'#EF4444',
	'#F59E0B',
	'#10B981',
	'#3B82F6',
	'#8B5CF6',
	'#EC4899',
	'#F3F4F6',
];

export function LineFloatingPalette() {
	const dispatch = useAppDispatch();
	const { color, thickness } = useAppSelector((s) => s.line);

	return (
		<div className="fixed left-20 top-52 z-40 w-[320px] rounded-2xl border border-gray-200 bg-white shadow-xl p-3 backdrop-blur-sm">
			<div className="flex items-center justify-between mb-2">
				<span className="text-sm font-medium text-gray-700">Line</span>
				<span className="text-xs text-gray-400">Thickness & Color</span>
			</div>

			{/* Thickness presets */}
			<div className="flex items-center gap-2 overflow-x-auto pb-1">
				{THICKNESSES.map((t) => (
					<button
						key={t}
						data-testid={`line-thickness-${t}`}
						aria-label={`thickness-${t}`}
						onClick={() => dispatch(setLineThickness(t))}
						className={`relative grid place-items-center rounded-full border border-gray-200 bg-white p-1 hover:bg-gray-50 transition ${
							thickness === t ? 'ring-2 ring-indigo-400' : ''
						}`}
					>
						<span
							className="block rounded-full"
							style={{
								width: t * 2 + 4,
								height: t * 2 + 4,
								background: color,
							}}
						/>
					</button>
				))}
			</div>

			<div className="my-3 h-px bg-gray-100" />

			{/* Color presets */}
			<div className="flex items-center gap-2 flex-wrap">
				{COLORS.map((c) => (
					<button
						key={c}
						data-testid={`line-color-${c}`}
						aria-label={`color-${c}`}
						onClick={() => dispatch(setLineColor(c))}
						className={`h-8 w-8 rounded-full border transition ${
							color === c ? 'ring-2 ring-indigo-400' : 'hover:scale-105'
						}`}
						style={{ background: c, borderColor: 'rgba(0,0,0,0.06)' }}
					/>
				))}

				{/* System color picker */}
				<label className="h-8 w-8 rounded-full border border-gray-200 grid place-items-center cursor-pointer">
					<input
						type="color"
						data-testid="line-input-color"
						value={color}
						onChange={(e) => dispatch(setLineColor(e.target.value))}
						className="opacity-0 absolute h-8 w-8 cursor-pointer"
					/>
					<svg width="18" height="18" viewBox="0 0 24 24">
						<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" />
					</svg>
				</label>
			</div>
		</div>
	);
}
