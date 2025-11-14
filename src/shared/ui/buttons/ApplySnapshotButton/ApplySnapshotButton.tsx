import { motion } from 'framer-motion';
import { useAppDispatch } from '@/store/hooks';
import { applyCurrentSnapshot } from '@/entities/history/model';

export function ApplySnapshotButton() {
	const dispatch = useAppDispatch();

	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={() => dispatch(applyCurrentSnapshot())}
			className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded cursor-pointer shadow"
		>
			Apply snapshot
		</motion.button>
	);
}
