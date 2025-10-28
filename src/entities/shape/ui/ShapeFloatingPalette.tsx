import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	setShapeFill,
	setShapeStroke,
	setShapeThickness,
	setShapeType,
	type ShapeType,
} from '@/entities/shape/model';
import { TOOL_COLORS, TOOL_SIZES } from '@/shared/constants';
import { ToolFloatingPalette } from '@/widgets/toolbar/model';
import { Circle, Square } from 'lucide-react';

// ─── Shape type icons ───────────────────────────────────────────
const SHAPE_TYPES: { type: ShapeType; icon: React.ReactNode; label: string }[] = [
	{ type: 'rect', icon: <Square className="w-5 h-5" />, label: 'Rectangle' },
	{ type: 'circle', icon: <Circle className="w-5 h-5" />, label: 'Circle' },
];

export const ShapeFloatingPalette = React.memo(function ShapeFloatingPalette() {
	const dispatch = useAppDispatch();
	const { type, fill, stroke, thickness } = useAppSelector((s) => s.shape);

	const handleTypeChange = useCallback(
		(newType: ShapeType) => {
			dispatch(setShapeType(newType));
		},
		[dispatch],
	);

	const handleFillChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			dispatch(setShapeFill(e.target.value));
		},
		[dispatch],
	);

	const handleStrokeChange = useCallback(
		(color: string) => {
			dispatch(setShapeStroke(color));
		},
		[dispatch],
	);

	const handleThicknessChange = useCallback(
		(value: number) => {
			dispatch(setShapeThickness(value));
		},
		[dispatch],
	);

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
			position="top-72"
		>
			<div className="flex items-center justify-between gap-3">
				{/* ───────── Shape Type Buttons ───────── */}
				<div className="flex items-center gap-2">
					{SHAPE_TYPES.map(({ type: t, icon, label }) => (
						<motion.button
							key={t}
							type="button"
							onClick={() => handleTypeChange(t)}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							className={`flex items-center justify-center w-8 h-8 rounded-md border transition-all
								${
									type === t
										? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm'
										: 'border-gray-200 text-gray-500 hover:bg-gray-100'
								}`.trim()}
							aria-label={label}
							data-testid={`shape-type-${t}`}
						>
							{icon}
						</motion.button>
					))}
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
