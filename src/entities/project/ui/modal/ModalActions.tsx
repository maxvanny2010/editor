import { motion } from 'framer-motion';

interface ModalActionsProps {
	onClose: () => void;
	buttonLabel: string;
	loading: boolean;
	showInput?: boolean;
}

export function ModalActions({
	onClose,
	buttonLabel,
	loading,
	showInput = true,
}: ModalActionsProps) {
	return (
		<div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
			{/* Cancel button */}
			<motion.button
				type="button"
				whileHover={{ y: -1 }}
				whileTap={{ scale: 0.97 }}
				onClick={onClose}
				className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-600
						   hover:text-gray-800 hover:bg-gray-100
						   transition focus:outline-none"
			>
				Cancel
			</motion.button>

			{/* Submit button */}
			<motion.button
				type="submit"
				data-testid="project-submit"
				whileHover={{ y: -1 }}
				whileTap={{ scale: 0.97 }}
				disabled={loading}
				className={`rounded-full px-5 py-1.5 text-sm font-semibold text-white transition-all shadow-sm focus:outline-none ${
					showInput
						? 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
						: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
				} focus:ring-2 focus:ring-indigo-400 disabled:opacity-70`}
			>
				{loading ? `${buttonLabel}ing...` : buttonLabel}
			</motion.button>
		</div>
	);
}
