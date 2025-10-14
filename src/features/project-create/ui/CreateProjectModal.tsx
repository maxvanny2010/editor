import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createProject } from '@/entities/project/model';
import { PROJECT_MESSAGES } from '@/shared/constants';
import { useAppDispatch } from '@/store/hooks.ts';

interface CreateProjectModalProps {
	onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose }) => {
	const dispatch = useAppDispatch();

	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!name.trim()) {
			setError(PROJECT_MESSAGES.EMPTY_NAME);
			return;
		}

		try {
			setLoading(true);
			await dispatch(createProject({ name })).unwrap();
			setName('');
			onClose();
		} catch (err) {
			const message = (err as Error).message;
			if (message.includes('exists')) {
				setError(PROJECT_MESSAGES.DUPLICATE_NAME);
			} else {
				setError(PROJECT_MESSAGES.UNEXPECTED_SERVER_ERROR);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="create-project-title"
			className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
		>
			<motion.form
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				onSubmit={handleSubmit}
				className="bg-white rounded-2xl p-8 shadow-2xl w-[420px] space-y-5"
			>
				<h2
					id="create-project-title"
					className="text-2xl font-semibold text-gray-800"
				>
					Create new project
				</h2>

				<input
					type="text"
					placeholder="Project name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
				/>

				{error && (
					<p
						role="alert"
						data-testid="error-msg"
						className="text-red-500 text-sm mt-1"
					>
						{error}
					</p>
				)}

				<div className="flex justify-end gap-2">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
					>
						Cancel
					</button>

					<button
						type="submit"
						disabled={loading}
						className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-70"
					>
						{loading ? 'Creating...' : 'Create'}
					</button>
				</div>
			</motion.form>
		</div>
	);
};
