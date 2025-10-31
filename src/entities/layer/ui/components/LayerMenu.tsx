import React, { useEffect, useRef } from 'react';
import {
	MoreVertical as MenuIcon,
	Pencil as RenameIcon,
	Trash2 as DeleteIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface LayerMenuProps {
	layerId: string;
	isMenuOpen: boolean;
	setOpenMenuId: (id: string | null) => void;
	onRenameClick: () => void;
	onDeleteClick: () => void;
}

export function LayerMenu({
	layerId,
	isMenuOpen,
	setOpenMenuId,
	onRenameClick,
	onDeleteClick,
}: LayerMenuProps) {
	const menuRef = useRef<HTMLDivElement>(null);

	// Close menu if click out of menu
	useEffect(() => {
		if (!isMenuOpen) return;

		const handleOutsideClick = (e: MouseEvent) => {
			if (!menuRef.current) return;
			if (!menuRef.current.contains(e.target as Node)) {
				setOpenMenuId(null);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);
		return () => document.removeEventListener('mousedown', handleOutsideClick);
	}, [isMenuOpen, setOpenMenuId]);

	// Toggle menu
	const handleMenuClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setOpenMenuId(isMenuOpen ? null : layerId);
	};

	return (
		<div className="relative" ref={menuRef}>
			<button
				onClick={handleMenuClick}
				className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
				aria-label="Layer options menu"
				data-testid="layer-menu-btn"
			>
				<MenuIcon className="w-4 h-4" />
			</button>

			{/* Animated context menu using Framer Motion */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						// Closes the menu if the mouse leaves the menu area.
						onMouseLeave={() => setOpenMenuId(null)}
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.15 }}
						className="absolute right-0 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-md z-10 origin-top-right"
						role="menu"
					>
						<button
							className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
							onClick={onRenameClick}
						>
							<RenameIcon className="w-4 h-4 text-gray-600" />
							Rename
						</button>
						<button
							className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
							onClick={onDeleteClick}
						>
							<DeleteIcon className="w-4 h-4" />
							Delete
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
