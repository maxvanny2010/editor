import { motion } from 'framer-motion';
import type { ShapeType } from '@/entities/shape/model';
import React from 'react';

interface ShapeTypeButtonProps {
	type: ShapeType;
	selected: boolean;
	icon: React.ReactNode;
	label: string;
	onSelect: (type: ShapeType) => void;
}

export const ShapeTypeButton = React.memo(function ShapeTypeButton({
	type,
	selected,
	icon,
	label,
	onSelect,
}: ShapeTypeButtonProps) {
	return (
		<motion.button
			type="button"
			onClick={() => onSelect(type)}
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
			className={`flex items-center justify-center w-8 h-8 rounded-md border transition-all ${
				selected
					? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm'
					: 'border-gray-200 text-gray-500 hover:bg-gray-100'
			}`}
			aria-label={label}
			data-testid={`shape-type-${type}`}
		>
			{icon}
		</motion.button>
	);
});
