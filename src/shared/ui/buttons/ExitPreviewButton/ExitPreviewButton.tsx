import { motion } from 'framer-motion';
import { useAppDispatch } from '@/store/hooks';
import { setPreview } from '@/entities/history/model/slice';

export function ExitPreviewButton() {
	const dispatch = useAppDispatch();

	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={() => dispatch(setPreview(false))}
			className="text-sm text-gray-700 hover:underline cursor-pointer"
		>
			Exit preview
		</motion.button>
	);
}
