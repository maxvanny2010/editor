import { settingsTable } from '@/entities/settings/api/settings.db';

export const activeProjectRepository = {
	async get(): Promise<string | null> {
		const row = await settingsTable.get('active');
		return row?.projectId ?? null;
	},

	async set(projectId: string): Promise<void> {
		await settingsTable.put({ id: 'active', projectId });
	},

	async clear(): Promise<void> {
		await settingsTable.delete('active');
	},
};
