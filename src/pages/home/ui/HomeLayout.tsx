import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface HomeLayoutProps {
	children: ReactNode;
	onNewProject: () => void;
}

export const HomeLayout = ({ children, onNewProject }: HomeLayoutProps) => {
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
			{/* ───────── Header ───────── */}
			<header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-gray-200">
				<div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
					<h1 className="text-2xl font-bold text-gray-800 tracking-tight">
						My Projects
					</h1>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.97 }}
						onClick={onNewProject}
						className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="w-5 h-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 4v16m8-8H4"
							/>
						</svg>
						New Project
					</motion.button>
				</div>
			</header>

			{/* ───────── Main content ───────── */}
			<main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">{children}</main>
		</div>
	);
};
