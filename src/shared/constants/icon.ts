import {
	Brush,
	Circle,
	Edit3,
	Eraser,
	Minus,
	PlusSquare,
	Shuffle,
	SlidersHorizontal,
	Square,
	Trash2,
} from 'lucide-react';

import type { EditorTool, ShapeType } from '@/shared/types';

// ─────────────────────────────────────────────────────────────
// Icon keys
// ─────────────────────────────────────────────────────────────
export const ICON_KEYS = {
	BRUSH: 'brush',
	LINE: 'line',
	SHAPE_RECT: 'shape-rect',
	SHAPE_CIRCLE: 'shape-circle',
	ERASER: 'eraser',

	// system
	EDIT: 'edit',
	TRASH: 'trash',
	SHUFFLE: 'shuffle',
	SLIDERS: 'sliders',
	PLUS_SQUARE: 'plus-square',
} as const;

// ─────────────────────────────────────────────────────────────
// System icons
// ─────────────────────────────────────────────────────────────
export const SYSTEM_ICON_NAMES = [
	'plus-square',
	'trash',
	'edit',
	'shuffle',
	'sliders',
] as const;

export type SystemIconName = (typeof SYSTEM_ICON_NAMES)[number];

// ─────────────────────────────────────────────────────────────
// Mapping icon keys → React components
// ─────────────────────────────────────────────────────────────
export const ICON_MAP = {
	[ICON_KEYS.BRUSH]: Brush,
	[ICON_KEYS.ERASER]: Eraser,
	[ICON_KEYS.LINE]: Minus,
	[ICON_KEYS.SHAPE_RECT]: Square,
	[ICON_KEYS.SHAPE_CIRCLE]: Circle,

	[ICON_KEYS.EDIT]: Edit3,
	[ICON_KEYS.TRASH]: Trash2,
	[ICON_KEYS.SHUFFLE]: Shuffle,
	[ICON_KEYS.SLIDERS]: SlidersHorizontal,
	[ICON_KEYS.PLUS_SQUARE]: PlusSquare,
} as const;

// ─────────────────────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────────────────────
export const ICON_COLORS = {
	[ICON_KEYS.BRUSH]: 'text-blue-600 bg-blue-100',
	[ICON_KEYS.ERASER]: 'text-red-600 bg-red-100',
	[ICON_KEYS.LINE]: 'text-green-600 bg-green-100',
	[ICON_KEYS.SHAPE_RECT]: 'text-purple-600 bg-purple-100',
	[ICON_KEYS.SHAPE_CIRCLE]: 'text-purple-600 bg-purple-100',
	DEFAULT: 'text-gray-600 bg-gray-100',
} as const;

// ─────────────────────────────────────────────────────────────
// Unified resolver
// ─────────────────────────────────────────────────────────────
export function resolveIconKey(
	type: EditorTool | null,
	shape?: ShapeType,
	iconName?: string | null,
) {
	if (iconName) return iconName;

	switch (type) {
		case 'brush':
			return ICON_KEYS.BRUSH;
		case 'eraser':
			return ICON_KEYS.ERASER;
		case 'line':
			return ICON_KEYS.LINE;
		case 'shape':
			return shape === 'circle' ? ICON_KEYS.SHAPE_CIRCLE : ICON_KEYS.SHAPE_RECT;
		default:
			return ICON_KEYS.EDIT;
	}
}

export type IconKey = keyof typeof ICON_MAP;
