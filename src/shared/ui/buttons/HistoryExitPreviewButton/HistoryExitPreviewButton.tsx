import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/store/hooks';
import { setPreview } from '@/entities/history/model/slice';

export const HistoryExitPreviewButton = React.memo(function HistoryExitPreviewButton() {
	const dispatch = useAppDispatch();

	return (
		<motion.button
			whileHover={{ scale: 1.04 }}
			whileTap={{ scale: 0.96 }}
			onClick={() => dispatch(setPreview(false))}
			className="flex-1 border border-gray-300 hover:bg-gray-50 text-sm py-1 rounded cursor-pointer"
		>
			Exit
		</motion.button>
	);
});
