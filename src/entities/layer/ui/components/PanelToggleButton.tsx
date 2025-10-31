import { AnimatePresence, motion } from 'framer-motion';
import { Layers as LayersIcon } from 'lucide-react';

interface PanelToggleButtonProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export function PanelToggleButton({ open, setOpen }: PanelToggleButtonProps) {
	return (
		<AnimatePresence>
			{!open && (
				<motion.button
					initial={{ opacity: 0, x: 40 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 40 }}
					transition={{ type: 'spring', stiffness: 240, damping: 25 }}
					onClick={() => setOpen(true)}
					aria-label="Open Layers Panel"
					className="
                        fixed right-0 top-[72px]
                        z-50 flex items-center justify-center
                        w-10 h-10 rounded-l-md bg-indigo-600 text-white shadow-lg
                        hover:bg-indigo-700 transition-all
                    "
				>
					<LayersIcon className="w-5 h-5" />
				</motion.button>
			)}
		</AnimatePresence>
	);
}
