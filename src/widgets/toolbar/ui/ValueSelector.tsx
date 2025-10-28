interface ValueSelectorProps {
	values: number[];
	selectedValue: number;
	selectedColor: string;
	onChange: (value: number) => void;
	dataPrefix?: string;
}

export const ValueSelector = ({
	values,
	selectedValue,
	selectedColor,
	onChange,
	dataPrefix = 'tool',
}: ValueSelectorProps) => {
	return (
		<div className="flex items-center gap-2 overflow-x-auto py-2 min-h-[64px]">
			{values.map((v) => (
				<button
					key={v}
					data-testid={`${dataPrefix}-value-${v}`}
					onClick={() => onChange(v)}
					className={`relative grid place-items-center rounded-full border border-gray-200 bg-white p-1 hover:bg-gray-50 transition shrink-0
            ${selectedValue === v ? 'ring-2 ring-offset-1 ring-indigo-400' : ''}`}
				>
					<span
						className="block rounded-full"
						style={{
							width: v * 2 + 4,
							height: v * 2 + 4,
							background: selectedColor,
						}}
					/>
				</button>
			))}
		</div>
	);
};
