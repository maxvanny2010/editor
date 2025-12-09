import { SelectorButton } from '@/shared/ui/buttons';

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
			{colors.map((color) => (
				<SelectorButton
					key={color}
					testId={`${dataPrefix}-color-${color}`}
					selected={color === selectedColor}
					onClick={() => onChange(color)}
					className="h-8 w-8 rounded-full p-0"
				>
					<span
						className="block h-full w-full rounded-full"
						style={{
							background: color,
							borderColor: 'rgba(0,0,0,0.06)',
							borderWidth: 1,
							borderStyle: 'solid',
						}}
					/>
				</SelectorButton>
			))}

			{/* Custom color picker */}
			<label className="relative h-8 w-8 rounded-full border border-gray-200 grid place-items-center cursor-pointer">
				<input
					type="color"
					data-testid={`${dataPrefix}-input-color`}
					value={selectedColor}
					onChange={(e) => onChange(e.target.value)}
					className="absolute inset-0 opacity-0 cursor-pointer"
				/>
				<svg width="18" height="18" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" />
				</svg>
			</label>
		</div>
	);
};
