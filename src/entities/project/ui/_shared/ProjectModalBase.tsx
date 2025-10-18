import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PROJECT_MESSAGES } from '@/shared/constants';
import { useAppDispatch } from '@/store/hooks';
import { projectNameSchema } from '@/shared/schema';
import { ZodError } from 'zod';

interface ProjectModalBaseProps<TArgs extends Record<string, unknown>> {
	title: string;
	buttonLabel: string;
	onClose: () => void;
	onSubmitAction: (
		dispatch: ReturnType<typeof useAppDispatch>,
		args: TArgs,
	) => Promise<void>;
	initialValue?: string;
	buildArgs: (name: string) => TArgs;
	disableAutoClose?: boolean;
	showInput?: boolean;
	customContent?: React.ReactNode;
	'data-testid'?: string;
}
/**
 * Base modal layout for project operations (Create / Update / Delete)
 * Handles validation, async dispatching, error feedback and visuals.
 */
export function ProjectModalBase<TArgs extends Record<string, unknown>>({
	title,
	buttonLabel,
	onClose,
	onSubmitAction,
	initialValue = '',
	buildArgs,
	showInput = true,
	customContent,
	'data-testid': testId,
}: ProjectModalBaseProps<TArgs>) {
	const dispatch = useAppDispatch();
	const [name, setName] = useState(initialValue);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		try {
			if (showInput) {
				projectNameSchema.parse(name);
			}

			setLoading(true);
			await onSubmitAction(dispatch, buildArgs(name));
			onClose();
		} catch (err) {
			if (err instanceof ZodError) {
				setError(
					err.issues[0]?.message ?? PROJECT_MESSAGES.UNEXPECTED_SERVER_ERROR,
				);
				return;
			}

			const message = (err as Error).message;
			setError(
				message.includes('exists')
					? PROJECT_MESSAGES.DUPLICATE_NAME
					: PROJECT_MESSAGES.UNEXPECTED_SERVER_ERROR,
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div
			role="dialog"
			aria-modal="true"
			data-testid={testId}
			className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
		>
			{/* ───────── MODAL CONTAINER ───────── */}
			<motion.form
				data-testid="project-form"
				initial={{ opacity: 0, scale: 0.92, y: 15 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.9, y: 15 }}
				transition={{ duration: 0.25, ease: 'easeOut' }}
				onSubmit={handleSubmit}
				className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 shadow-xl w-[420px] space-y-6"
			>
				{/* ───────── HEADER ───────── */}
				<div className="flex flex-col items-start">
					<h2 className="text-[22px] font-semibold text-gray-900 tracking-tight">
						{title}
					</h2>
					<div className="w-10 border-t-2 border-indigo-500 mt-2" />
				</div>

				{/* ───────── INPUT FIELD ───────── */}
				{showInput ? (
					<div className="space-y-2">
						<label
							htmlFor="project-name"
							className="block text-sm font-medium text-gray-600"
						>
							Project name
						</label>
						<input
							id="project-name"
							type="text"
							value={name}
							data-testid="project-input"
							maxLength={25}
							placeholder="Enter project name (max 25 chars)"
							onChange={(e) => setName(e.target.value)}
							className="border border-gray-300 rounded-lg px-4 py-2.5 w-full text-gray-800 bg-white/80
									   focus:ring-2 focus:ring-indigo-500 focus:shadow-[0_0_8px_rgba(99,102,241,0.25)]
									   outline-none transition"
						/>
						{error && (
							<p role="alert" className="text-red-500 text-sm mt-1">
								{error}
							</p>
						)}
					</div>
				) : (
					<div className="text-gray-700 text-sm">{customContent}</div>
				)}

				{/* ───────── ACTION BUTTONS ───────── */}
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

					{/* Primary action button */}
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
			</motion.form>
		</div>
	);
}
