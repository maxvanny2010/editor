import { motion } from 'framer-motion';

export const ProjectEmptyState = () => (
	<motion.div
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500"
		data-testid="empty-state"
	>
		<div className="bg-gray-100 p-8 rounded-xl shadow-inner max-w-sm">
			<p className="text-lg font-medium mb-3">No projects yet</p>
			<p className="text-sm mb-6">
				Start by creating your first project to begin editing.
			</p>
		</div>
	</motion.div>
);
