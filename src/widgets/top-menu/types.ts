import type { LucideIcon } from 'lucide-react';

export type TopMenuTab = 'file' | 'projects';

export interface TopMenuItem {
	label: string;
	onClick: () => void;
	icon?: LucideIcon;
	divider?: boolean;
	colorClass?: string;
}

export const TOP_MENU_TABS: TopMenuTab[] = ['file', 'projects'];
