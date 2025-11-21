import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TopMenuItemButton, TopMenuTabButton } from '@/shared/ui/buttons';
import { TOP_MENU_TABS, type TopMenuItem, type TopMenuTab } from './types';
import { MENU_ICON_COLORS, MENU_LABELS, PROJECT_PATHS } from '@/shared/constants';

interface Props {
	onNewProject: () => void;
	onSaveProject: () => void;
	onExportPng: () => void;
}

export function TopMenu({ onNewProject, onSaveProject, onExportPng }: Props) {
	const [openTab, setOpenTab] = useState<TopMenuTab | null>(null);
	const navigate = useNavigate();

	const toggle = (tab: TopMenuTab) => setOpenTab((prev) => (prev === tab ? null : tab));

	const renderMenu = (items: TopMenuItem[]) => (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, y: -8, scale: 0.96 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: -8, scale: 0.94 }}
				transition={{ duration: 0.18, ease: [0.22, 1.2, 0.36, 1] }}
				onMouseLeave={() => setOpenTab(null)}
				className="
				absolute top-full left-0 mt-1 w-52 py-2
				bg-white border border-gray-200 shadow-xl rounded-md
				z-[9999]
			"
			>
				{items.map((item, i) => (
					<TopMenuItemButton
						key={i}
						label={item.label}
						IconComponent={item.icon}
						colorClass={item.colorClass}
						onClick={() => {
							setOpenTab(null);
							item.onClick();
						}}
						divider={item.divider}
					/>
				))}
			</motion.div>
		</AnimatePresence>
	);

	// FILE MENU
	const fileMenu: TopMenuItem[] = [
		{
			label: MENU_LABELS.FILE.NEW.label,
			icon: MENU_LABELS.FILE.NEW.icon,
			colorClass: MENU_ICON_COLORS.NEW,
			onClick: onNewProject,
		},
		{ divider: true, label: '', onClick: () => {} },
		{
			label: MENU_LABELS.FILE.SAVE.label,
			icon: MENU_LABELS.FILE.SAVE.icon,
			colorClass: MENU_ICON_COLORS.SAVE,
			onClick: onSaveProject,
		},
		{
			label: MENU_LABELS.FILE.EXPORT.label,
			icon: MENU_LABELS.FILE.EXPORT.icon,
			colorClass: MENU_ICON_COLORS.EXPORT,
			onClick: onExportPng,
		},
	];

	// PROJECTS MENU
	const projectsMenu: TopMenuItem[] = [
		{
			label: MENU_LABELS.PROJECTS.OPEN_ALL.label,
			icon: MENU_LABELS.PROJECTS.OPEN_ALL.icon,
			colorClass: MENU_ICON_COLORS.OPEN_ALL,
			onClick: () => navigate(PROJECT_PATHS.HOME),
		},
	];

	const menuMap: Record<TopMenuTab, TopMenuItem[]> = {
		file: fileMenu,
		projects: projectsMenu,
	};

	return (
		<div
			className="
				fixed top-0 left-0 right-0 h-10
				bg-white/80 backdrop-blur-sm border-b border-gray-200
				flex items-center gap-6 px-4 z-[9999] shadow-sm
				select-none
			"
		>
			{TOP_MENU_TABS.map((tab) => (
				<div
					key={tab}
					className="relative cursor-pointer"
					tabIndex={0}
					onBlur={(e) => {
						if (!e.currentTarget.contains(e.relatedTarget)) {
							setOpenTab(null);
						}
					}}
				>
					<TopMenuTabButton
						label={tab}
						isActive={openTab === tab}
						onClick={() => toggle(tab)}
					/>

					{openTab === tab && renderMenu(menuMap[tab])}
				</div>
			))}
		</div>
	);
}
