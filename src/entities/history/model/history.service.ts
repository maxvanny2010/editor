import { historyRepository } from '@/entities/history/api';
import type { HistoryEntry } from '@/shared/types';

export const historyService = {
	async saveEntry(entry: HistoryEntry): Promise<void> {
		await historyRepository.add(entry);
	},

	async loadByProject(projectId: string): Promise<HistoryEntry[]> {
		return historyRepository.getByProject(projectId);
	},

	async deleteAfterIndex(projectId: string, index: number): Promise<void> {
		await historyRepository.deleteAfterIndex(projectId, index);
	},

	async resetProject(projectId: string): Promise<void> {
		await historyRepository.clearByProject(projectId);
	},

	async resetAll(): Promise<void> {
		await historyRepository.clearAll();
	},
};
