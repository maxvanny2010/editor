import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/store/hooks';
import { applyCurrentSnapshot } from '@/entities/history/model';

export const HistoryApplySnapshotButton = React.memo(
	function HistoryApplySnapshotButton() {
		const dispatch = useAppDispatch();

		return (
			<motion.button
				whileHover={{ scale: 1.04 }}
				whileTap={{ scale: 0.96 }}
				onClick={() => dispatch(applyCurrentSnapshot())}
				className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 rounded cursor-pointer shadow-sm"
			>
				Apply snapshot
			</motion.button>
		);
	},
);
