import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createProjectThunk } from '@/entities/project/model/thunks';
import { projectsActions } from '@/entities/project/model/slice.ts';

export const CreateProjectModal = ({ onClose }: { onClose: () => void }) => {
	const [name, setName] = useState('');
	const dispatch = useAppDispatch();
	const { loading, error } = useAppSelector((s) => s.projects);

	const handleCreate = async () => {
		try {
			await dispatch(createProjectThunk({ name })).unwrap();
			onClose();
		} catch (err) {
			console.error('Failed to create project:', err);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (error) dispatch(dispatch(projectsActions.clearError()));
		setName(e.target.value);
	};

	return (
		<div className="p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-lg font-semibold mb-3">Создать проект</h2>
			<input
				className="border w-full p-2 rounded text-sm"
				type="text"
				value={name}
				onChange={handleChange}
				placeholder="Введите название проекта"
			/>
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
			<button
				onClick={handleCreate}
				disabled={loading === 'pending'}
				className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
			>
				{loading === 'pending' ? 'Создание...' : 'Создать'}
			</button>
		</div>
	);
};
