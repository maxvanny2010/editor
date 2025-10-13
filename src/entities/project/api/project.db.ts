import { db } from '@/shared/lib/db/dexie';

/**
 * Typed shortcut to the projects table.
 * Keeps the entity domain independent of shared infrastructure.
 */
export const projectTable = db.projects;
