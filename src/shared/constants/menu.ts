import { FilePlus, FolderOpen, ImageDown, Save } from 'lucide-react';

export const MENU_LABELS = {
	FILE: {
		NEW: { label: 'New Project', icon: FilePlus },
		SAVE: { label: 'Save Project', icon: Save },
		EXPORT: { label: 'Export PNG', icon: ImageDown },
	},

	PROJECTS: {
		OPEN_ALL: { label: 'All Projects', icon: FolderOpen },
	},
} as const;

export const MENU_ICON_COLORS = {
	NEW: 'text-emerald-600',
	SAVE: 'text-blue-600',
	EXPORT: 'text-amber-600',
	OPEN_ALL: 'text-purple-600',
};
