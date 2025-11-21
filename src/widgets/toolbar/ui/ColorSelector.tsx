interface ColorSelectorProps {
	colors: string[];
	selectedColor: string;
	onChange: (color: string) => void;
	dataPrefix?: string;
}

export const ColorSelector = ({
	colors,
	selectedColor,
	onChange,
	dataPrefix = 'tool',
}: ColorSelectorProps) => {
	return (
		<div className="flex items-center gap-2 flex-wrap">
			{colors.map((c) => (
				<button
					key={c}
					data-testid={`${dataPrefix}-color-${c}`}
					onClick={() => onChange(c)}
					className={`h-8 w-8 rounded-full border transition ${
						selectedColor === c ? 'ring-2 ring-indigo-400' : 'hover:scale-105'
					}`}
					style={{ background: c, borderColor: 'rgba(0,0,0,0.06)' }}
				/>
			))}

			<label className="h-8 w-8 rounded-full border border-gray-200 grid place-items-center cursor-pointer">
				<input
					type="color"
					data-testid={`${dataPrefix}-input-color`}
					value={selectedColor}
					onChange={(e) => onChange(e.target.value)}
					className="opacity-0 absolute h-8 w-8 cursor-pointer"
				/>
				<svg width="18" height="18" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" />
				</svg>
			</label>
		</div>
	);
};
