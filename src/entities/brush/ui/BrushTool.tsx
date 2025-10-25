import { Brush } from 'lucide-react';
import { motion } from 'framer-motion';
import { BrushFloatingPalette } from '@/entities/brush/model';
import { setActiveTool } from '@/entities/editor/model/slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectActiveTool } from '@/entities/editor/model/selectors';

export function BrushTool() {
	const dispatch = useAppDispatch();
	const activeTool = useAppSelector(selectActiveTool);
	const isActive = activeTool === 'brush';

	const handleClick = () => {
		dispatch(setActiveTool(isActive ? null : 'brush'));
	};

	return (
		<>
			{/* Brush button */}
			<motion.button
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				onClick={handleClick}
				data-testid={`brush-tool-button`}
				aria-label="Brush Tool"
				className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
					isActive
						? 'bg-indigo-100 text-indigo-600'
						: 'hover:bg-gray-100 text-gray-700'
				}`}
			>
				{/* ICON — real brush shape */}
				<Brush className="w-5 h-5" />

				{isActive && (
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.8, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="absolute inset-0 rounded-full border-2 border-indigo-500"
					/>
				)}
			</motion.button>

			{isActive && <BrushFloatingPalette />}
		</>
	);
}
