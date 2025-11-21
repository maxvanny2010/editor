import type { LucideIcon } from 'lucide-react';
import { History, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { NAMES, UI_LABELS } from '@/shared/constants';

type PanelKey = 'layers' | 'history' | null;

interface SidebarItem {
	key: Exclude<PanelKey, null>;
	label: string;
	icon: LucideIcon;
	color: string;
}

interface RightSidebarProps {
	active: PanelKey;
	onSelect: (key: PanelKey) => void;
}

/**
 * Static right sidebar — controls opening of side panels (Layers, History, Settings).
 * Always visible and visually separated from the canvas.
 */
export function RightSidebar({ active, onSelect }: RightSidebarProps) {
	const items: SidebarItem[] = [
		{
			key: NAMES.LAYERS,
			label: UI_LABELS.LAYERS,
			icon: Layers,
			color: 'bg-indigo-600',
		},
		{
			key: NAMES.HISTORY,
			label: UI_LABELS.HISTORY,
			icon: History,
			color: 'bg-amber-600',
		},
	];

	const handleToggle = (key: Exclude<PanelKey, null>) =>
		onSelect(active === key ? null : key);

	return (
		<aside className="fixed top-12 right-0 bottom-16 w-16 flex flex-col items-center justify-start gap-4 py-6 bg-gray-900 text-white shadow-2xl border-l border-gray-800 z-50">
			{items.map(({ key, label, icon: Icon, color }) => {
				const isActive = active === key;
				return (
					<motion.button
						key={key}
						onClick={() => handleToggle(key)}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						className={`relative w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-200 ${
							isActive
								? `${color} shadow-lg`
								: 'bg-gray-700 hover:bg-gray-600'
						}`}
						title={label}
						aria-pressed={isActive}
					>
						<Icon className="w-5 h-5" />
						{isActive && (
							<motion.span
								layoutId="sidebar-active-indicator"
								className="absolute inset-0 rounded-md ring-2 ring-white/30"
								transition={{
									type: 'spring',
									stiffness: 300,
									damping: 25,
								}}
							/>
						)}
					</motion.button>
				);
			})}
		</aside>
	);
}
