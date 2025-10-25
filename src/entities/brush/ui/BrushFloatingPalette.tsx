import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setBrushColor, setBrushSize } from '@/entities/brush/model/slice';

const SIZES = [1, 2, 4, 8, 12, 20];
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

export function BrushFloatingPalette() {
	const dispatch = useAppDispatch();
	const { color, size } = useAppSelector((s) => s.brush);

	return (
		<div className="fixed left-20 top-24 z-40 w-[320px] rounded-2xl border border-gray-200 bg-white shadow-xl p-3 backdrop-blur-sm">
			<div className="flex items-center justify-between mb-2">
				<span className="text-sm font-medium text-gray-700">Brush</span>
				<span className="text-xs text-gray-400">Size & Color</span>
			</div>

			{/* Size presets */}
			<div className="flex items-center gap-2 overflow-x-auto pb-1">
				{SIZES.map((s) => (
					<button
						key={s}
						data-testid={`brush-size-${s}`}
						aria-label={`size-${s}`}
						onClick={() => dispatch(setBrushSize(s))}
						className={`relative grid place-items-center rounded-full border border-gray-200 bg-white p-1 hover:bg-gray-50 transition ${
							size === s ? 'ring-2 ring-indigo-400' : ''
						}`}
					>
						<span
							className="block rounded-full"
							style={{
								width: s * 2 + 4,
								height: s * 2 + 4,
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
						data-testid={`brush-color-${c}`}
						aria-label={`color-${c}`}
						onClick={() => dispatch(setBrushColor(c))}
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
						data-testid={`brush-input-color`}
						value={color}
						onChange={(e) => dispatch(setBrushColor(e.target.value))}
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
