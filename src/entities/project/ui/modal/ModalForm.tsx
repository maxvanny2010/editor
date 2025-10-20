import React from 'react';
import { motion } from 'framer-motion';

interface ModalFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
	title: string;
	children: React.ReactNode;
	'data-testid'?: string;
}

export function ModalForm({
	title,
	children,
	'data-testid': testId,
	onSubmit,
}: ModalFormProps) {
	return (
		<motion.form
			noValidate
			data-testid={testId}
			initial={{ opacity: 0, scale: 0.92, y: 15 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.9, y: 15 }}
			transition={{ duration: 0.25, ease: 'easeOut' }}
			onSubmit={onSubmit}
			className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 shadow-xl w-[420px] space-y-6"
		>
			{/* ───────── HEADER ───────── */}
			<div className="flex flex-col items-start">
				<h2 className="text-[22px] font-semibold text-gray-900 tracking-tight">
					{title}
				</h2>
				<div className="w-10 border-t-2 border-indigo-500 mt-2" />
			</div>

			{children}
		</motion.form>
	);
}
