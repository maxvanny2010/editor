import { memo, type ReactNode } from 'react';
import { ColorSelector, ValueSelector } from '@/widgets/toolbar/ui';

interface ToolFloatingPaletteProps {
	title: string;
	subtitle: string;
	values: number[];
	colors?: string[];
	selectedValue: number;
	selectedColor?: string;
	onValueChange: (value: number) => void;
	onColorChange?: (color: string) => void;
	position?: string;
	children?: ReactNode;
}

export const ToolFloatingPalette = memo(function ToolFloatingPalette({
	title,
	subtitle,
	values,
	colors,
	selectedValue,
	selectedColor = '#6B7280',
	onValueChange,
	onColorChange,
	position = 'bottom-44',
	children,
}: ToolFloatingPaletteProps) {
	const hasColors = Array.isArray(colors) && colors.length > 0;

	return (
		<div
			className={`fixed left-20 ${position} z-40 w-[320px] rounded-2xl border border-gray-200 bg-white shadow-xl p-3 backdrop-blur-sm`}
		>
			<header className="flex items-center justify-between mb-2">
				<span className="text-sm font-medium text-gray-700">{title}</span>
				<span className="text-xs text-gray-400">{subtitle}</span>
			</header>

			<ValueSelector
				values={values}
				selectedValue={selectedValue}
				selectedColor={selectedColor}
				onChange={onValueChange}
				dataPrefix={title.toLowerCase()}
			/>

			{hasColors && (
				<>
					<hr className="my-3 h-px bg-gray-100" />
					<ColorSelector
						colors={colors}
						selectedColor={selectedColor}
						onChange={onColorChange!}
						dataPrefix={title.toLowerCase()}
					/>
				</>
			)}

			{children && <div className="mt-3">{children}</div>}
		</div>
	);
});
