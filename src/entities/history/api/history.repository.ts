import type { HistoryEntry } from '@/shared/types';
import { historyTable } from '@/entities/history/api';
import { REPOSITORY_FIELDS } from '@/shared/constants';

export const historyRepository = {
	async add(entry: HistoryEntry): Promise<void> {
		await historyTable.put(entry);
	},

	async getByProject(projectId: string): Promise<HistoryEntry[]> {
		return historyTable
			.where(`${REPOSITORY_FIELDS.STATE_PROJECT_ID}`)
			.equals(projectId)
			.sortBy(`${REPOSITORY_FIELDS.TIMESTAMP}`);
	},
	async deleteById(id: string): Promise<void> {
		await historyTable.where('id').equals(id).delete();
	},

	async deleteAfterIndex(projectId: string, index: number): Promise<void> {
		const all = await this.getByProject(projectId);
		const toDelete = all.slice(index + 1);
		if (toDelete.length === 0) return;

		await Promise.all(toDelete.map((e) => this.deleteById(e.id)));
	},

	async clearByProject(projectId: string): Promise<void> {
		await historyTable
			.where(`${REPOSITORY_FIELDS.STATE_PROJECT_ID}`)
			.equals(projectId)
			.delete();
	},

	async clearAll(): Promise<void> {
		await historyTable.clear();
	},
};
