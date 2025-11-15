import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { activeProjectRepository } from '@/entities/settings/api';
import { projectRepository } from '@/entities/project/api';
import { loadProjectData } from '@/features/editor';
import { setActiveProjectId } from '@/entities/project/model/slice';
import type { AppDispatch } from '@/store';
import { activeProjectService } from '@/entities/settings/model';

vi.mock('@/entities/settings/api');
vi.mock('@/entities/project/api');
vi.mock('@/features/editor');
vi.mock('@/entities/project/model/slice');

describe('activeProjectService', () => {
	let mockDispatch: Mock;

	beforeEach(() => {
		vi.clearAllMocks();

		// Create a mock that returns an object with unwrap method
		mockDispatch = vi.fn(() => {
			// Return a thenable object that looks like a Redux Toolkit async thunk result
			return {
				unwrap: vi.fn().mockResolvedValue(undefined),
			};
		}) as Mock;
	});

	describe('getActiveProjectId', () => {
		it('returns active project id from repository', async () => {
			vi.mocked(activeProjectRepository.get).mockResolvedValue('p1');

			const result = await activeProjectService.getActiveProjectId();

			expect(activeProjectRepository.get).toHaveBeenCalled();
			expect(result).toBe('p1');
		});

		it('returns null when no active project', async () => {
			vi.mocked(activeProjectRepository.get).mockResolvedValue(null);

			const result = await activeProjectService.getActiveProjectId();

			expect(result).toBeNull();
		});
	});

	describe('setActiveProject', () => {
		it('sets active project in repository and redux', async () => {
			await activeProjectService.setActiveProject(
				mockDispatch as AppDispatch,
				'p1',
			);

			expect(activeProjectRepository.set).toHaveBeenCalledWith('p1');
			expect(mockDispatch).toHaveBeenCalledWith(setActiveProjectId('p1'));
		});

		it('does nothing for empty projectId', async () => {
			await activeProjectService.setActiveProject(mockDispatch as AppDispatch, '');

			expect(activeProjectRepository.set).not.toHaveBeenCalled();
			expect(mockDispatch).not.toHaveBeenCalled();
		});
	});

	describe('clearActiveProject', () => {
		it('clears active project', async () => {
			await activeProjectService.clearActiveProject(mockDispatch as AppDispatch);

			expect(activeProjectRepository.clear).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledWith(setActiveProjectId(null));
		});
	});

	describe('isRestoring', () => {
		it('returns false initially', () => {
			expect(activeProjectService.isRestoring()).toBe(false);
		});
	});

	describe('restoreIntoEditor', () => {
		it('restores project from URL', async () => {
			vi.mocked(projectRepository.exists).mockResolvedValue(true);

			const result = await activeProjectService.restoreIntoEditor(
				mockDispatch as AppDispatch,
				'p-url',
			);

			expect(result).toBe('p-url');
			expect(projectRepository.exists).toHaveBeenCalledWith('p-url');
			expect(mockDispatch).toHaveBeenCalledWith(setActiveProjectId('p-url'));
			expect(mockDispatch).toHaveBeenCalledWith(loadProjectData('p-url'));
			expect(activeProjectRepository.set).toHaveBeenCalledWith('p-url');
		});

		it('restores from repository when no URL', async () => {
			vi.mocked(activeProjectRepository.get).mockResolvedValue('p-saved');
			vi.mocked(projectRepository.exists).mockResolvedValue(true);

			const result = await activeProjectService.restoreIntoEditor(
				mockDispatch as AppDispatch,
			);

			expect(result).toBe('p-saved');
			expect(activeProjectRepository.get).toHaveBeenCalled();
			expect(projectRepository.exists).toHaveBeenCalledWith('p-saved');
		});

		it('returns null when no project id', async () => {
			vi.mocked(activeProjectRepository.get).mockResolvedValue(null);

			const result = await activeProjectService.restoreIntoEditor(
				mockDispatch as AppDispatch,
			);

			expect(result).toBeNull();
			expect(projectRepository.exists).not.toHaveBeenCalled();
		});

		it('returns null and clears when project missing', async () => {
			vi.mocked(activeProjectRepository.get).mockResolvedValue('p-miss');
			vi.mocked(projectRepository.exists).mockResolvedValue(false);

			const result = await activeProjectService.restoreIntoEditor(
				mockDispatch as AppDispatch,
			);

			expect(result).toBeNull();
			expect(activeProjectRepository.clear).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledWith(setActiveProjectId(null));
		});

		it('does not clear when URL project missing', async () => {
			vi.mocked(projectRepository.exists).mockResolvedValue(false);

			const result = await activeProjectService.restoreIntoEditor(
				mockDispatch as AppDispatch,
				'p-bad',
			);

			expect(result).toBeNull();
			expect(activeProjectRepository.clear).not.toHaveBeenCalled();
		});

		it('prevents parallel calls', async () => {
			vi.mocked(activeProjectRepository.get).mockResolvedValue('p1');
			vi.mocked(projectRepository.exists).mockResolvedValue(true);

			const [r1, r2] = await Promise.all([
				activeProjectService.restoreIntoEditor(mockDispatch as AppDispatch),
				activeProjectService.restoreIntoEditor(mockDispatch as AppDispatch),
			]);

			expect(r1).toBe('p1');
			expect(r2).toBe('p1');
			expect(activeProjectRepository.get).toHaveBeenCalledTimes(1);
		});

		it('does not persist repository project', async () => {
			vi.mocked(activeProjectRepository.get).mockResolvedValue('p-exist');
			vi.mocked(projectRepository.exists).mockResolvedValue(true);

			await activeProjectService.restoreIntoEditor(mockDispatch as AppDispatch);

			expect(activeProjectRepository.set).not.toHaveBeenCalled();
		});

		it('resets flag after completion', async () => {
			vi.mocked(activeProjectRepository.get).mockResolvedValue('p1');
			vi.mocked(projectRepository.exists).mockResolvedValue(true);

			await activeProjectService.restoreIntoEditor(mockDispatch as AppDispatch);

			expect(activeProjectService.isRestoring()).toBe(false);
		});

		it('resets flag after error', async () => {
			vi.mocked(activeProjectRepository.get).mockRejectedValue(
				new Error('DB error'),
			);

			await expect(
				activeProjectService.restoreIntoEditor(mockDispatch as AppDispatch),
			).rejects.toThrow('DB error');

			expect(activeProjectService.isRestoring()).toBe(false);
		});
	});
});
