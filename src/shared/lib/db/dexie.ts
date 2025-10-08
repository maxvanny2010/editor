// src/shared/lib/db/dexie.ts

import Dexie, { type Table } from 'dexie';
import type { Project } from '@/shared/types';

/**
 * EditorDB — локальная база данных приложения.
 * Хранит проекты. Позже можно расширить для layers и history.
 */
export class EditorDB extends Dexie {
	projects!: Table<Project, string>;

	constructor() {
		super('EditorDB');

		// Версия 1: таблица проектов
		this.version(1).stores({
			projects: 'id, name, createdAt, updatedAt',
		});
	}
}

// Экспорт одного инстанса для всего приложения
export const db = new EditorDB();
