import { SelectorButton } from '@/shared/ui/buttons';

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
		<div className="flex items-center gap-2 overflow-x-auto py-2 min-h-[64px] pl-3 pr-2 scroll-px-2">
			{values.map((value) => (
				<SelectorButton
					key={value}
					testId={`${dataPrefix}-value-${value}`}
					selected={value === selectedValue}
					onClick={() => onChange(value)}
				>
					<span
						className="block rounded-full"
						style={{
							width: value * 2 + 4,
							height: value * 2 + 4,
							background: selectedColor,
						}}
					/>
				</SelectorButton>
			))}
		</div>
	);
};
