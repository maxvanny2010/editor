import type { Layer } from '@/shared/types';

interface OpacitySliderProps {
	activeLayer: Layer | undefined;
	onOpacityChange: (id: string, value: number) => void;
}

export function OpacitySlider({ activeLayer, onOpacityChange }: OpacitySliderProps) {
	const active = activeLayer;
	const opacityValue = active?.opacity ?? 1;

	return (
		<div className="flex items-center gap-3">
			<label className="text-xs text-gray-600 w-20">Opacity</label>
			<div className="relative flex-1">
				{/* Range input for opacity control. It's disabled if no layer is active. */}
				<input
					type="range"
					min={0}
					max={1}
					step={0.01}
					disabled={!active}
					value={opacityValue}
					onChange={(e) => {
						if (!active) return;
						onOpacityChange(active.id, Number(e.target.value));
					}}
					className="
                       w-full h-1.5 rounded-lg appearance-none cursor-pointer
                       bg-gray-200 accent-indigo-600
                       disabled:opacity-50
                       /* Custom styles for the thumb (slider handle) in Webkit and Firefox for a progressive look */
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:h-3
                       [&::-webkit-slider-thumb]:w-3
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-indigo-600
                       [&::-webkit-slider-thumb]:shadow-md
                       [&::-webkit-slider-thumb]:border-2
                       [&::-webkit-slider-thumb]:border-white

                       [&::-moz-range-thumb]:h-3
                       [&::-moz-range-thumb]:w-3
                       [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-indigo-600
                       [&::-moz-range-thumb]:border-2
                       [&::-moz-range-thumb]:border-white
                    "
					// Uses a linear gradient to visually represent the progress fill of the slider track.
					style={{
						background: `linear-gradient(to right, #4f46e5 ${opacityValue * 100}%, #e5e7eb ${opacityValue * 100}%)`,
					}}
				/>
			</div>
			{/* Display the opacity value as a percentage */}
			<span className="w-10 text-right text-xs tabular-nums">
				{Math.round(opacityValue * 100)}%
			</span>
		</div>
	);
}
