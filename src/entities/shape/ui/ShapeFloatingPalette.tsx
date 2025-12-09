import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	selectShapeState,
	setShapeFill,
	setShapeStroke,
	setShapeThickness,
	setShapeType,
	type ShapeType,
} from '@/entities/shape/model';
import { TOOL_COLORS, TOOL_SIZES } from '@/shared/constants';
import { ToolFloatingPalette } from '@/widgets/toolbar/ui';
import { Circle, Square } from 'lucide-react';
import { ShapeTypeButton } from '@/shared/ui/buttons';

// ─── Shape type icons ───────────────────────────────────────────
const SHAPE_TYPES: { type: ShapeType; icon: React.ReactNode; label: string }[] = [
	{ type: 'rect', icon: <Square className="w-5 h-5" />, label: 'Rectangle' },
	{ type: 'circle', icon: <Circle className="w-5 h-5" />, label: 'Circle' },
];

export const ShapeFloatingPalette = React.memo(function ShapeFloatingPalette() {
	const dispatch = useAppDispatch();
	const { type, fill, stroke, thickness } = useAppSelector(selectShapeState);

	const handleTypeChange = useCallback(
		(newType: ShapeType) => {
			dispatch(setShapeType(newType));
		},
		[dispatch],
	);

	const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(setShapeFill(e.target.value));
	};

	const handleStrokeChange = (color: string) => {
		dispatch(setShapeStroke(color));
	};

	const handleThicknessChange = (value: number) => {
		dispatch(setShapeThickness(value));
	};

	return (
		<ToolFloatingPalette
			title="Shape Tool"
			subtitle="Fill / Stroke / Type"
			values={TOOL_SIZES}
			colors={TOOL_COLORS}
			selectedValue={thickness}
			selectedColor={stroke}
			onValueChange={handleThicknessChange}
			onColorChange={handleStrokeChange}
			position="bottom-8"
		>
			<div className="flex items-center justify-between gap-3">
				{/* ───────── Shape Type Buttons ───────── */}
				<div className="flex items-center gap-2">
					{SHAPE_TYPES.map(
						({ type: shapeType, icon: shapeIcon, label: shapeLabel }) => (
							<ShapeTypeButton
								key={shapeType}
								type={shapeType}
								icon={shapeIcon}
								label={shapeLabel}
								selected={type === shapeType}
								onSelect={handleTypeChange}
							/>
						),
					)}
				</div>

				{/* ───────── Fill Color Picker ───────── */}
				<input
					type="color"
					value={fill}
					onChange={handleFillChange}
					className="w-8 h-8 rounded-md border border-gray-200 cursor-pointer"
					data-testid="shape-fill-color"
				/>
			</div>
		</ToolFloatingPalette>
	);
});
