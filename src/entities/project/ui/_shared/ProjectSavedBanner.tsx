import { AnimatePresence, motion } from 'framer-motion';
import { useAutoHide } from '@/entities/project/hooks';

export function ProjectSavedBanner({
	show,
	onHide,
}: {
	show: boolean;
	onHide: () => void;
}) {
	useAutoHide(show, 2000, onHide);

	return (
		<AnimatePresence>
			{show && (
				<motion.div
					initial={{ y: -60, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -60, opacity: 0 }}
					transition={{ duration: 0.4, ease: 'easeOut' }}
					className="
                        fixed left-1/2 top-4 -translate-x-1/2 z-[9999]
                        px-6 py-3 rounded-xl shadow-lg backdrop-blur-md
                        bg-rose-500/90 text-white font-medium
						dark:bg-emerald-400/90
					"
				>
					Project saved successfully
				</motion.div>
			)}
		</AnimatePresence>
	);
}
