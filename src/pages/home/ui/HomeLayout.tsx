import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface HomeLayoutProps {
	children: ReactNode;
	onNewProject: () => void;
}

export const HomeLayout = ({ children, onNewProject }: HomeLayoutProps) => {
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
			{/* ───────── HEADER ───────── */}
			<header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-gray-200">
				<div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
					<h1 className="text-2xl font-bold text-gray-800 tracking-tight select-none">
						My Projects
					</h1>

					{/* ───────── NEW PROJECT BUTTON ───────── */}
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.96 }}
						onClick={onNewProject}
						className="relative group flex items-center gap-2 px-6 py-3 rounded-full
								   bg-indigo-600 text-white font-semibold tracking-tight
								   overflow-hidden cursor-pointer shadow-md
								   transition-all duration-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]
								   focus:outline-none select-none"
					>
						{/* ── Magical energy aura (clearly visible) ── */}
						<span
							className="absolute -inset-[6px] rounded-full bg-gradient-to-r
									   from-indigo-500 via-purple-500 to-indigo-400
									   opacity-40 group-hover:opacity-80 blur-2xl
									   animate-[energy_3.5s_ease-in-out_infinite]
									   transition-opacity"
						/>

						{/* ── Button background overlay ── */}
						<span className="absolute inset-0 rounded-full bg-indigo-600/90 group-hover:bg-indigo-700 transition-colors duration-200" />

						{/* ── Icon and label ── */}
						<span className="relative flex items-center gap-2 z-10">
							<motion.svg
								initial={{ rotate: 0 }}
								whileHover={{ rotate: 90 }}
								transition={{ duration: 0.4 }}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2.2}
								stroke="currentColor"
								className="w-5 h-5 drop-shadow-sm pointer-events-none"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 4v16m8-8H4"
								/>
							</motion.svg>
							New Project
						</span>
					</motion.button>
				</div>
			</header>

			{/* ───────── MAIN CONTENT ───────── */}
			<main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">{children}</main>
		</div>
	);
};
