import { settingsTable } from '@/entities/settings/api/settings.db';
import { activeProjectRepository } from '@/entities/settings/api';

vi.mock('@/entities/settings/api/settings.db', () => ({
	settingsTable: {
		get: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
	},
}));

describe('activeProjectRepository', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('get', () => {
		it('returns projectId when active setting exists', async () => {
			vi.spyOn(settingsTable, 'get').mockResolvedValue({
				id: 'active',
				projectId: 'project-123',
			});

			const result = await activeProjectRepository.get();

			expect(settingsTable.get).toHaveBeenCalledWith('active');
			expect(result).toBe('project-123');
		});

		it('returns null when active setting does not exist', async () => {
			vi.spyOn(settingsTable, 'get').mockResolvedValue(undefined);

			const result = await activeProjectRepository.get();

			expect(settingsTable.get).toHaveBeenCalledWith('active');
			expect(result).toBeNull();
		});

		it('returns null when projectId is undefined', async () => {
			vi.spyOn(settingsTable, 'get').mockResolvedValue({
				id: 'active',
				projectId: undefined,
			});

			const result = await activeProjectRepository.get();

			expect(result).toBeNull();
		});
	});

	describe('set', () => {
		it('saves projectId to settings table', async () => {
			vi.spyOn(settingsTable, 'put').mockResolvedValue('active');

			await activeProjectRepository.set('project-456');

			expect(settingsTable.put).toHaveBeenCalledWith({
				id: 'active',
				projectId: 'project-456',
			});
		});

		it('overwrites existing active project', async () => {
			vi.spyOn(settingsTable, 'put').mockResolvedValue('active');

			await activeProjectRepository.set('project-old');
			await activeProjectRepository.set('project-new');

			expect(settingsTable.put).toHaveBeenCalledTimes(2);
			expect(settingsTable.put).toHaveBeenLastCalledWith({
				id: 'active',
				projectId: 'project-new',
			});
		});
	});

	describe('clear', () => {
		it('deletes active setting from table', async () => {
			vi.spyOn(settingsTable, 'delete').mockResolvedValue(undefined);

			await activeProjectRepository.clear();

			expect(settingsTable.delete).toHaveBeenCalledWith('active');
		});

		it('handles deletion when no active project exists', async () => {
			vi.spyOn(settingsTable, 'delete').mockResolvedValue(undefined);

			await expect(activeProjectRepository.clear()).resolves.not.toThrow();
		});
	});

	describe('error handling', () => {
		it('propagates errors from get', async () => {
			const error = new Error('Database error');
			vi.spyOn(settingsTable, 'get').mockRejectedValue(error);

			await expect(activeProjectRepository.get()).rejects.toThrow('Database error');
		});

		it('propagates errors from set', async () => {
			const error = new Error('Write error');
			vi.spyOn(settingsTable, 'put').mockRejectedValue(error);

			await expect(activeProjectRepository.set('project-123')).rejects.toThrow(
				'Write error',
			);
		});

		it('propagates errors from clear', async () => {
			const error = new Error('Delete error');
			vi.spyOn(settingsTable, 'delete').mockRejectedValue(error);

			await expect(activeProjectRepository.clear()).rejects.toThrow('Delete error');
		});
	});
});
